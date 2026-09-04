# ZFS Monitoring

Beszel automatically monitors ZFS pools when the agent has access to the `zpool` and `zfs` command-line tools. For each pool it reports capacity, allocation, health, and I/O throughput, and for each dataset it reports usage.

## Requirements

The `zpool` and `zfs` binaries must be installed and accessible to the agent user. OpenZFS is included with Proxmox, TrueNAS, and most distributions that ship ZFS.

To verify the agent user can run them:

```bash
zpool list
zfs list
```

## Docker agent

Use the `:alpine` image, which includes the ZFS utilities, and map the ZFS control device into the container:

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
  devices:
    - /dev/zfs:/dev/zfs
```

Mapping `/dev/zfs` is required — without it the ZFS commands cannot communicate with the kernel and no pool data will be reported.

## Binary agent

The binary agent needs `zpool` and `zfs` available to its user on the host, which OpenZFS provides on Proxmox, TrueNAS, and most distributions that ship ZFS.

If ZFS pools are not detected when running the agent as a systemd service, you may need to allow access to the ZFS control device:

```ini
[Service]
DeviceAllow=/dev/zfs rw
```

After updating the service, reload systemd and restart the agent.

## What is displayed

- **Pools table** — each pool with its health state, capacity, allocation, and scrub status.
- **Per-pool charts** — usage and I/O charts.
- **Pool details** — clicking a pool opens a sheet with per-vdev error counters, and a sortable, filterable list of datasets with their usage.

## Refresh interval

Pool capacity, health, and I/O are reported with the regular system metrics. The more detailed data (scrub status, vdevs, datasets) is refreshed on the `ZFS_INTERVAL` (default `1h`). See [Environment Variables](./environment-variables).

## Alerts

If at least one notification channel is configured, a pool health change to a worse state (e.g. `ONLINE` → `DEGRADED`) automatically triggers a notification. The alert is resolved when the pool returns to `ONLINE`.

Note that if a pool is already degraded on first detection by the agent, no alert will fire. ZFS pool usage is also included in the disk threshold alert.
