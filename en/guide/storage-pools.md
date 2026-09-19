# Storage Pools

Beszel monitors ZFS pools and Btrfs filesystems, reporting capacity, usage, health, and I/O throughput. ZFS monitoring also includes scrub status and dataset usage.

## ZFS

The agent needs access to the `zpool` and `zfs` command-line tools. OpenZFS provides these utilities.

To verify the agent user can run them:

```bash
zpool list
zfs list
```

### Docker agent

Use the `:alpine` image, which includes the ZFS utilities, and map the ZFS control device into the container:

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
  devices:
    - /dev/zfs:/dev/zfs
```

Mapping `/dev/zfs` is required for the ZFS commands to communicate with the kernel.

### Binary agent

Install the ZFS utilities on the host and ensure they are accessible to the agent user.

If ZFS pools are not detected when running the agent as a systemd service, you may need to allow access to the ZFS control device:

```ini
[Service]
DeviceAllow=/dev/zfs rw
```

After updating the service, reload systemd and restart the agent.

## Btrfs

On Linux, the agent automatically discovers Btrfs filesystems through `/sys/fs/btrfs`. No Btrfs command-line tools or special agent image are required.

Each filesystem appears as a storage pool, including filesystems that span multiple devices. The agent reports member-device error counters and marks a filesystem as `DEGRADED` when a device is missing. Btrfs scrub status and subvolume usage are not currently reported.

### Docker agent

Btrfs pools can be reported without additional folder mounts, provided the agent can read the host’s Btrfs sysfs information.

For accurate capacity reporting on resized filesystems, create a directory on the filesystem and bind-mount it read-only into the agent:

```yaml
beszel-agent:
  image: henrygd/beszel-agent
  volumes:
    - /mnt/storage/.beszel:/extra-filesystems/storage:ro
```

One accessible folder per Btrfs filesystem is enough, including multi-device RAID filesystems. Existing `/extra-filesystems` mounts can provide this access. The agent user must be able to access the directory.

If the capacity query fails, the pool continues to be reported using sysfs backing-device sizes (noted as "raw" in the UI).

### Binary agent

The agent needs read access to Btrfs sysfs information. For recorded capacity reporting, its user must also be able to open a path on the mounted filesystem.

### Capacity reporting

The agent prefers Btrfs’s recorded member-device capacity, which it queries through an accessible filesystem mount. If the query is unavailable or fails, it falls back to the backing-device sizes reported by sysfs.

The fallback can overstate capacity and understate usage percentages when a Btrfs filesystem has been shrunk without shrinking its backing partition or device.

### Older kernels

When device health information is unavailable, health is **UNKNOWN**. Device details depend on kernel support: `devinfo` is available since Linux 5.6 and error counters since Linux 5.14.

## What is displayed

- **Pools table** — each pool’s health, capacity, and usage, plus scrub status for ZFS.
- **Per-pool charts** — usage and I/O throughput.
- **Pool details** — device error counters; ZFS pools also include a sortable, filterable dataset list with usage.

## Refresh interval

Pool metrics are included in regular system updates. Capacity is refreshed approximately once per minute, while health and I/O are sampled with regular updates.

Detailed pool information is refreshed on `ZFS_INTERVAL` (default `1h`). Despite its name, this setting applies to both ZFS and Btrfs pool details. See [Environment Variables](./environment-variables).

## Alerts

If at least one notification channel is configured, a pool health change to a worse state (e.g. `ONLINE` → `DEGRADED`) automatically triggers a notification. The alert is resolved when the pool returns to `ONLINE`.

If a pool is already degraded when first detected, no health-change alert fires. Both ZFS and Btrfs pool usage are included in disk threshold alerts.
