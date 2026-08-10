# ZFS Monitoring

Beszel automatically monitors ZFS pools when the agent has access to the `zpool` and `zfs` command-line tools. For each pool it reports capacity, allocation, health, and I/O throughput, and for each dataset it reports usage.

## Requirements

The `zpool` and `zfs` binaries must be installed and accessible to the agent user. OpenZFS is included with Proxmox, TrueNAS, and most distributions that ship ZFS.

To verify the agent user can run them:

```bash
zpool list
zfs list
```

Because the agent shells out to these tools, ZFS monitoring requires the **binary agent** running on the host (or any system with OpenZFS installed). The default Docker agent image does not include the ZFS utilities.

## What is displayed

- **Pools table** — each pool with its health state, capacity, allocation, and I/O throughput. I/O comes from a streaming `zpool iostat` watcher, so it is always current.
- **Per-pool charts** — a stacked usage chart broken down by dataset (snapshots and bookmarks are excluded) and an I/O chart.
- **Pool details** — clicking a pool opens a sheet with scrub status, per-vdev error counters, and a sortable, filterable list of datasets with their usage.

## Refresh interval

Pool capacity, health, and I/O are reported with the regular system metrics. The more detailed data (scrub status, vdevs, datasets) is refreshed on the `ZFS_INTERVAL` (default `1h`). See [Environment Variables](./environment-variables).

## Alerts

If at least one notification channel is configured, a pool health change to a worse state (e.g. `ONLINE` → `DEGRADED`) automatically triggers a notification. The alert is resolved when the pool returns to `ONLINE`.

Note that if a pool is already degraded on first detection by the agent, no alert will fire. ZFS pool usage is also included in the disk threshold alert.
