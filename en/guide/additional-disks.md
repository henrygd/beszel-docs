# Additional Disks

You can use Beszel to monitor disks, partitions, or remote mounts.

The charts will use the name of the device or partition if available, and fall back to the directory name. You will not get I/O stats for network mounted drives.

::: tip Finding device information
Use `lsblk` to find the names and mount points of your partitions.

If you have trouble, set `LOG_LEVEL=debug` on the agent and check the logs for the lines starting with `DEBUG Disk partitions` and `DEBUG Disk I/O diskstats`.
:::

The configuration differs depending on your deployment method.

## Docker agent

Mount a folder from the target filesystem in the container's `/extra-filesystems` directory:

```yaml
volumes:
  - /mnt/disk1/.beszel:/extra-filesystems/sdb1:ro
  - /dev/mmcblk0/.beszel:/extra-filesystems/mmcblk0:ro
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
[Service]
Environment="EXTRA_FILESYSTEMS=sdb,sdc1,mmcblk0,/mnt/network-share"
```

:::

If using Systemd, the service configuration is usually located in `/etc/systemd/system/beszel-agent.service`.

After editing the service, reload system units with `systemctl daemon-reload`, followed by restarting the service with `systemctl restart beszel-agent`.
