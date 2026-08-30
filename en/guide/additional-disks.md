# Additional Disks

You can use Beszel to monitor disks, partitions, or remote mounts.

The charts will use the name of the device or partition if available, and fall back to the directory name. You will not get I/O stats for network mounted drives.

::: tip Finding device information
Use `lsblk -o NAME,KNAME,SIZE,TYPE,MOUNTPOINT` to find the names and mountpoints of your partitions. It is important to use the device's kernel name (KNAME) instead of the name reported by the device mapper (NAME). This can fix issues with reporting I/O stats of encrypted devices or logical volumes.

If you have trouble, set `LOG_LEVEL=debug` on the agent and check the logs for the lines starting with `DEBUG Disk partitions` and `DEBUG Disk I/O diskstats`.
:::

## Root disk

Set the `FILESYSTEM` environment variable to override the device, partition, or mount point used for root disk stats.

You can optionally add a custom display name after double underscores. For example, `FILESYSTEM=sda__OS` uses `sda` for root disk stats and displays the disk as "OS" in the interface.

The configuration for additional disks differs depending on your deployment method.

## Docker agent

Mount a folder from the target filesystem in the container's `/extra-filesystems` directory:

```yaml
volumes:
  - /mnt/disk1/.beszel:/extra-filesystems/sdb1:ro
  # give the device a custom name with double underscores
  - /mnt/media/.beszel:/extra-filesystems/sdc1__Media:ro
```

::: tip
If you get disk usage but not I/O (common for encrypted devices) you can specify the device to use for I/O with the mounted directory name. This should be an entry in `/proc/diskstats`. See [0.7.3 release notes](https://github.com/henrygd/beszel/releases/tag/v0.7.3) for more details.
:::

## Binary agent

Set the `EXTRA_FILESYSTEMS` environment variable to a comma-separated list of devices, partitions, or mount points to monitor. For example:

::: code-group

```bash [bash]
EXTRA_FILESYSTEMS="sdb,sdc1,mmcblk0,/mnt/network-share" KEY="..." ./beszel-agent
```

```ini [beszel-agent.service]
[Unit]
RequiresMountsFor=/mnt/ssd /mnt/media

[Service]
Environment="EXTRA_FILESYSTEMS=sdb,sdc1,mmcblk0,/mnt/network-share"
```

:::

If using Systemd, the service configuration is usually located in `/etc/systemd/system/beszel-agent.service`.

`RequiresMountsFor=` forces systemd to wait for the listed mount points before starting the agent. That is a risky default for disk monitoring, because a failed mount can prevent the service from starting at all.

A safer option is to omit `RequiresMountsFor=` and let the agent monitor the paths directly. If you do need ordering, use `After=mnt-ssd.mount` (or the matching mount unit) rather than `RequiresMountsFor=`.

After editing the service, reload system units with `systemctl daemon-reload`, followed by restarting the service with `systemctl restart beszel-agent`.

::: tip Custom names
You can give the device a custom name with double underscores. For example, `sdc1__Jellyfin Media`. This will use "Jellyfin Media" for the device name in the charts.
:::

## Windows agent

Set the `EXTRA_FILESYSTEMS` environment variable to a comma-separated list of drive letters to monitor. For example:

```dotenv
EXTRA_FILESYSTEMS="D:,E:,F:"
```

Instructions below assume you run the agent as a Windows service with NSSM.

### CLI

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:,F:"
```

### GUI


```powershell
nssm edit beszel-agent
```

Go to the **Environment** tab and add the variable:

```
EXTRA_FILESYSTEMS=D:,E:,F:
```

Click **Edit service**, then restart the service to apply the changes:

```powershell
nssm restart beszel-agent
```
