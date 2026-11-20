# S.M.A.R.T. Monitoring

Beszel parses S.M.A.R.T. data from `smartctl` and displays it on the system page if available. This usually requires increased permissions.

On Linux, Beszel also reports eMMC wear/EOL indicators and mdraid array health.

## Requirements

The minimum supported `smartctl` version is 7.0.

To make sure your system is compatible, install `smartmontools` on the agent machine, check your version, and scan for devices: {#install}

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
smartctl -v | head -1
```

```bash
sudo smartctl --scan
```

## Docker agent

Switch to the `:alpine` image and add the following to your `docker-compose.yml`. Make sure to replace the device names with your actual devices.

::: tip
This may not work with rootless Docker / Podman, which can't grant the required device access and capabilities. Use the binary agent instead.
:::

> Non-base images like `beszel-agent-intel` and `beszel-agent-nvidia` also work and don't require `:alpine`.

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
  devices:
    - /dev/sda:/dev/sda
    - /dev/nvme0:/dev/nvme0
  cap_add:
    - SYS_RAWIO # required for S.M.A.R.T. data
    - SYS_ADMIN # required for NVMe S.M.A.R.T. data
```

::: tip Pass in the base controller name, not the block / partition

Note that we are using `sda` and `nvme0` in our example, not `sda1` or `nvme0n1`.

:::

::: warning Some NVMe drives require access to the namespace device

Some NVMe drives may only report complete S.M.A.R.T. information, such as capacity, when accessed through the namespace device (for example, `/dev/nvme0n1`) rather than the controller (`/dev/nvme0`). For Docker, map the namespace device to the controller path:

```yaml
devices:
  - /dev/nvme0n1:/dev/nvme0
```

See [issue #1637](https://github.com/henrygd/beszel/issues/1637) for more details.

:::

## Binary agent

A guide to collecting this data without granting the agent these privileges on Linux (or at least, Debian) is available [here](./lower-privilege-agent/smart-data.md).

Make sure `smartctl` is installed by following the [installation instructions](#install).

On Linux, `smartctl` needs elevated privileges to talk to disks:

- SATA/ATA via SG_IO requires `CAP_SYS_RAWIO`
- NVMe admin passthrough requires `CAP_SYS_ADMIN`

### Recommended: systemd ambient capabilities

If you run the agent as a systemd service, add capabilities to the service instead of the process running as root.

1. Edit your service file (for example `/etc/systemd/system/beszel-agent.service`) and add the following under `[Service]`:

```ini
AmbientCapabilities=CAP_SYS_RAWIO CAP_SYS_ADMIN
CapabilityBoundingSet=CAP_SYS_RAWIO CAP_SYS_ADMIN
```

2. If you have existing `DeviceAllow` lines in your service file (for Nvidia GPUs, for example), you must also add `DeviceAllow` rules for your drives:

```ini
DeviceAllow=/dev/sda r
DeviceAllow=/dev/nvme0 r
```

::: warning Some NVMe drives require access to the namespace device

Some NVMe drives may only report complete S.M.A.R.T. information, such as capacity, when accessed through the namespace device (for example, `/dev/nvme0n1`) rather than the controller (`/dev/nvme0`). For a systemd installation, also allow access to the namespace device:

```ini
DeviceAllow=/dev/nvme0n1 r
```

See [issue #1637](https://github.com/henrygd/beszel/issues/1637) for more details.

:::

3. Reload and restart:

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

The install script runs the agent as the `beszel` user (`daemon` on OPNsense and pfSense, so use that name below instead).

`smartctl` reaches SATA and SAS disks through the CAM passthrough devices (`/dev/pass*` and `/dev/xpt0`) and NVMe drives through the controller devices (`/dev/nvme*`). It opens them read/write, and by default only root can do that. Group membership alone, including the `operator` group the install script adds, is not enough. Use a devfs rule to give a dedicated group read/write access.

1. Create a `smartctl` group and add the agent user to it:

   ```sh
   pw groupadd smartctl
   pw groupmod smartctl -m beszel
   ```

2. Check whether a devfs ruleset is already applied to `/dev`:

   ```sh
   sysrc -n devfs_system_ruleset
   ```

3. Add the rules to `/etc/devfs.rules`. This is file content, not a command to run.

   If the previous command printed nothing, create a new ruleset. The number in brackets must not be used by any other ruleset in `/etc/devfs.rules` or `/etc/defaults/devfs.rules`:

   ```ini
   [beszel_smart=100]
   add path 'pass*' mode 0660 group smartctl
   add path 'xpt0' mode 0660 group smartctl
   add path 'nvme*' mode 0660 group smartctl
   ```

   Then make it the system ruleset:

   ```sh
   sysrc devfs_system_ruleset="beszel_smart"
   ```

   If the previous command printed a ruleset name, add only the three `add path` lines to the end of that ruleset's section, and leave `devfs_system_ruleset` unchanged. Replacing it would drop your existing device permissions.

4. Apply the rules and restart the agent:

   ```sh
   service devfs restart
   service beszel-agent restart
   ```

::: warning
Write access to these devices lets members of the group send raw commands to your disks. Only add the agent user to the `smartctl` group.
:::

### Verify permissions

Find your device names with `smartctl --scan`, then test that `smartctl` works as the agent user:

::: code-group

```bash [Linux]
sudo -u beszel smartctl -H /dev/sda
sudo -u beszel smartctl -H /dev/nvme0
```

```sh [FreeBSD]
su -m beszel -c 'smartctl -H /dev/ada0'
su -m beszel -c 'smartctl -H /dev/nvme0'
```

:::

If each command prints a health assessment instead of a permission error (such as `Permission denied` or `Unable to open device`), the agent will be able to read S.M.A.R.T. data. Don't rely on the exit code: `smartctl` also returns a nonzero code when a drive has logged errors.

On FreeBSD, if you still get a permission error, check that the rules were applied. The devices should show group `smartctl` and mode `crw-rw----`:

```sh
ls -l /dev/xpt0 /dev/pass* /dev/nvme*
```

## Windows

As of 0.16.0, `smartctl` is included in the Windows agent package.

If it's not working properly, you can follow our previous guide to install `smartmontools` manually:

Download and install `smartmontools` from the official SourceForge page:

1. Go to [https://sourceforge.net/projects/smartmontools/files/](https://sourceforge.net/projects/smartmontools/files/)
2. Download the latest Windows installer (`.exe` file)
3. Run the installer as Administrator
4. Follow the installation wizard to complete the setup

After installation, verify that `smartctl` is accessible from the command line:

```cmd
smartctl --version
```

### Adding smartctl to PATH

::: details Click to expand/collapse

If your system cannot find the `smartctl` executable, you will need to manually add the smartmontools installation directory to your system's PATH environment variable.

To add smartctl to your PATH:

1. Open the **Edit the system environment variables** dialog:
   - Press `Win + R`, type `sysdm.cpl`, press Enter and go the Advanced tab.
   - Or search for "Environment Variables" in the Start menu

2. Click **Environment Variables...**

3. In the **System variables** section, select **Path** and click **Edit...**

4. Click **New** and add the smartmontools installation directory:

   ```
   C:\Program Files\smartmontools\bin
   ```

   ::: tip Installation path may vary
   The exact path depends on your installation location.

5. Open a new Command Prompt or PowerShell window and verify the installation:

   ```cmd
   smartctl --version
   ```

:::

### Scan for devices

Once `smartctl` is working, scan for available devices:

```cmd
smartctl --scan
```

The agent should now be able to collect S.M.A.R.T. data from your Windows system.

## Troubleshooting

### Commands still require sudo despite capabilities being set

If `smartctl` still fails even after setting capabilities (via systemd ambient capabilities or file capabilities), the issue is likely device permissions. Even with `CAP_SYS_RAWIO` and `CAP_SYS_ADMIN`, the user needs read access to the device files themselves.

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

::: tip Note for NVMe devices
Some systems set NVMe character devices (`/dev/nvme0`) to mode `600` (owner-only), even if SATA devices work fine with the `disk` group. If NVMe S.M.A.R.T. still doesn't work after adding the user to the `disk` group, see the solution below.
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

## Alerts

If at least one notification channel is configured and disks report S.M.A.R.T. data to Beszel, a failure automatically triggers a notification. This behaviour is not currently configurable.

Note that if a drive is already reporting failure on first detection by the Beszel agent, no alert will fire.
