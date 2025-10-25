# S.M.A.R.T. Monitoring

Beszel parses S.M.A.R.T. data from `smartctl` and displays it on the system page if available. This usually requires increased permissions.

To make sure your system is compatible, install `smartmontools` on the agent machine and scan for devices: {#install}


::: code-group 

```bash [Debian/Ubuntu]
sudo apt install smartmontools
```

```bash [Fedora]
sudo dnf install smartmontools
```

```bash [Arch]
sudo pacman -S smartmontools
```

```bash [FreeBSD]
pkg install smartmontools
```

```bash [macOS]
brew install smartmontools
```

:::


```bash
sudo smartctl --scan
```

## Docker agent

Switch to the `:alpine` image and add the following to your `docker-compose.yml`. Make sure to replace the device names with your actual devices.

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
   devices:
   - /dev/sda:/dev/sda
   - /dev/nvme0:/dev/nvme0
   cap_add:
   - SYS_RAWIO # required for SATA S.M.A.R.T. data
   - SYS_ADMIN # required for NVMe S.M.A.R.T. data
```

::: tip Pass in the base controller name, not the block / partition

Note that we are using `sda` and `nvme0` in our example, not `sda1` or `nvme0n1`.

:::

## Binary agent

Make sure `smartctl` is installed by following the [installation instructions](#install).

`smartctl` needs elevated privileges to talk to disks:

- SATA/ATA via SG_IO requires `CAP_SYS_RAWIO`
- NVMe admin passthrough requires `CAP_SYS_ADMIN`

### Recommended: systemd ambient capabilities

If you run the agent as a systemd service, add capabilities to the service instead of the process running as root.

1. Edit your service file (for example `/etc/systemd/system/beszel-agent.service`) and add the following under `[Service]`:

```ini
AmbientCapabilities=CAP_SYS_RAWIO CAP_SYS_ADMIN
CapabilityBoundingSet=CAP_SYS_RAWIO CAP_SYS_ADMIN
```

2. Reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent
```

If this doesn't work, try [adding the `beszel` user to the `disk` group](#disk-group).

### Alternative: file capabilities on smartctl 

If you don't use systemd or prefer not to change the service, you can add the needed capabilities to the `smartctl` binary and restrict execution to a dedicated group. This lets the agent user run `smartctl` with just the required privileges.

```bash
# grant capabilities required for SATA (RAWIO) and NVMe (SYS_ADMIN)
sudo setcap cap_sys_rawio,cap_sys_admin+ep "$(command -v smartctl)"

# optionally restrict execution to a dedicated group
sudo groupadd -r smartctl 2>/dev/null || true
sudo chgrp smartctl "$(command -v smartctl)"
sudo chmod 750 "$(command -v smartctl)"

# add the beszel service user to that group
sudo usermod -aG smartctl beszel
```

Then restart the agent. Note: If your systemd unit sets `NoNewPrivileges=yes`, file capabilities added to `smartctl` will not be usable by the agent.

### FreeBSD

Add the agent user to the `operator` group so it can access disk devices:

```sh
pw groupmod operator -m beszel
service beszel-agent restart
```

### Verify permissions

Test that `smartctl` works without sudo for the agent user:

```bash
sudo -u beszel smartctl -H /dev/sda
sudo -u beszel smartctl -H /dev/nvme0
```

If these commands succeed, the agent will be able to parse S.M.A.R.T. data.

## Troubleshooting

### Commands still require sudo despite capabilities being set

If `smartctl` still fails even after setting capabilities (via systemd ambient capabilities or file capabilities), the issue is likely **device permissions**. Even with `CAP_SYS_RAWIO` and `CAP_SYS_ADMIN`, the user needs read access to the device files themselves.

Check your device permissions:

```bash
ls -l /dev/sda /dev/nvme0
```

You'll typically see something like:

```
brw-rw---- root disk /dev/sda      # block device, group readable
crw------- root root /dev/nvme0    # char device, only root can read
```

#### Add user to disk group {#disk-group}

Most Linux distributions have a `disk` group that provides access to disk devices. Add the beszel user to this group:

```bash
sudo usermod -aG disk beszel
sudo systemctl restart beszel-agent
```

::: warning Security consideration
The `disk` group provides read/write access to all block devices. While this is the standard approach used by most system monitoring tools, it grants broader access than strictly necessary for S.M.A.R.T. monitoring alone.
:::

::: tip Note for NVMe devices
Some systems set NVMe character devices (`/dev/nvme0`) to mode `600` (owner-only), even if SATA devices work fine with the `disk` group. If NVMe S.M.A.R.T. still doesn't work after adding the user to the `disk` group, see Solution 2 below.
:::

#### Adjust NVMe device permissions 

If your NVMe devices are still inaccessible after adding the user to the `disk` group, you can adjust the device group to `disk`.

```bash
# Check current permissions
ls -l /dev/nvme0

# Create a udev rule that changes NVMe devices to disk group ownership
sudo tee /etc/udev/rules.d/99-smartctl-disk-group.rules > /dev/null << 'EOF'
# Change NVMe devices to disk group ownership for S.M.A.R.T. monitoring
KERNEL=="nvme[0-9]*", GROUP="disk", MODE="0660"
EOF

# Reload udev rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Verify the new permissions (should show disk group and 660 mode)
ls -l /dev/nvme0

# Restart the agent
sudo systemctl restart beszel-agent
```

This changes the group ownership to `disk` and the mode to `0660` (group-readable).

::: warning Potential conflicts
If other software on your system has created udev rules for the same devices, there may be conflicts. You can check for existing rules with:

```bash
grep -r "KERNEL.*nvme" /etc/udev/rules.d/
```

:::

To remove the udev rule:

```bash
sudo rm /etc/udev/rules.d/99-smartctl-disk-group.rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```

