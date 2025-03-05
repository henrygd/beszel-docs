# Common Issues

## Agent is not connecting

Check the logs page in PocketBase (`/_/#/logs`) for information about the error.

The most likely cause is a firewall blocking the connection request. In this case you have two options:

1. Add an inbound rule to the agent system's firewall(s) to allow TCP connections to the port. Check any active firewalls, like iptables, and your cloud provider's firewall settings if applicable.
2. Alternatively, use software like WireGuard, Tailscale ([video instructions](https://www.youtube.com/watch?v=O_9wT-5LoHM)), or Cloudflare Tunnel ([instructions](https://github.com/henrygd/beszel/discussions/250)) to securely bypass the firewall.

You can test connectivity by running `telnet <agent-ip> <port>` from another device on your network.

## Connecting hub and agent on the same system using Docker

Because the hub and agent are in different networks (the agent uses host network mode), the recommended way to connect them is to use a unix socket. See the [Getting Started](./getting-started.md) guide for a full `docker-compose.yml` example.

## Finding the correct filesystem

Specify the filesystem/device/partition for root disk stats using the `FILESYSTEM` environment variable.

If not set, the agent will try to find the partition mounted on `/` and use that. This may not work correctly in a container, so it's recommended to set this value. Use one of the following methods to find the correct filesystem:

- Run `lsblk` and choose an option under "NAME."
- Run `df -h` and choose an option under "Filesystem."
- Run `sudo fdisk -l` and choose an option under "Device."

## Docker container charts are empty or missing

If container charts show empty data or don't appear at all, you may need to enable cgroup memory accounting. To verify, run `docker stats`. If that shows zero memory usage, follow this guide to fix the issue:

<https://akashrajpurohit.com/blog/resolving-missing-memory-stats-in-docker-stats-on-raspberry-pi/>


## Docker stats missing with rootless agent

See [issue #640](https://github.com/henrygd/beszel/issues/640) where [tercerapersona](https://github.com/tercerapersona) posted a solution. Use the correct socket path for your user and [enable cgroup CPU delegation](https://rootlesscontaine.rs/getting-started/common/cgroup2/#enabling-cpu-cpuset-and-io-delegation) if CPU stats are missing.

## Docker containers are not populating reliably

Upgrade your Docker version on the agent system if possible. There is a bug in Docker 24, and possibly earlier versions, that may cause this issue. We've added a workaround to the agent to mitigate this issue, but it's not a perfect fix.

## Month / week records are not populating reliably

Records for longer time periods are created by averaging stats from shorter periods. The agent must run uninterrupted for a full set of data to populate these records.

Pausing/unpausing the agent for longer than one minute will result in incomplete data, resetting the timing for the current interval.
