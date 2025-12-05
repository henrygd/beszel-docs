# Common Issues

If your issue is not listed here, please search our [GitHub Issues](https://github.com/henrygd/beszel/issues) and [Discussions](https://github.com/henrygd/beszel/discussions) for a solution. You can also try asking in the community-run [Matrix room](https://matrix.to/#/#beszel:matrix.org).

## Agent is not connecting

Check the logs page in PocketBase (`/_/#/logs`) for information about the error. One of the two communication directions described below needs to be working.

The agent initiates a WebSocket connection to the hub at `/api/beszel/agent-connect`, so make sure this endpoint is accessible. If [using a reverse proxy](./reverse-proxy.md), make sure it's able to proxy WebSocket connections.

The hub initiates a TCP connection to the agent, so make sure the port on the agent system is not blocked.

1. Check any active firewalls, like iptables, and your cloud provider's firewall settings if applicable. Add an inbound rule allowing TCP connections to the port.
2. Alternatively, use software like WireGuard, Tailscale ([video instructions](https://www.youtube.com/watch?v=O_9wT-5LoHM)), Cloudflare Tunnel ([instructions](https://github.com/henrygd/beszel/discussions/250)), or Pangolin ([instructions](https://github.com/henrygd/beszel/discussions/1163)) to securely bypass the firewall.

You can test connectivity by running `telnet <agent-ip> <port>` from another device on your network.

## Connecting hub and agent on the same system using Docker

When connecting to a local agent, `localhost` will not work because the containers are in different networks. The recommended way to connect them is to use a unix socket.

<!-- @include: ./parts/hub-docker-instructions.md -->

## Real time stats not working / changes not saving

Check if you have gzip or some other encoding being applied at the proxy level.

The web UI needs compression disabled on anything with content type `text/event-stream` for SSE to work properly.

If you use Coolify, uncheck "Enable gzip compression" in the hub service settings.

## Finding the correct filesystem

Specify the filesystem/device/partition for root disk stats using the `FILESYSTEM` environment variable.

If not set, the agent will try to find the partition mounted on `/` and use that. This may not work correctly in a container, so it's recommended to set this value. Use one of the following methods to find the correct filesystem:

- Run `lsblk` and choose an option under "NAME."
- Run `df -h` and choose an option under "Filesystem."
- Run `sudo fdisk -l` and choose an option under "Device."

## Self-signed certificate issues in Docker

When running Beszel in a Docker container and connecting to services that use self-signed certificates, you may encounter TLS certificate verification errors.

The error typically looks like this:

```
tls: failed to verify certificate: x509: certificate signed by unknown authority
```

To resolve this issue, you need to provide your custom CA certificate to the Docker container:

1. Save your CA certificate file (e.g., `custom-ca.crt`) on the host system
2. Mount it into the container's certificate directory:

```yaml
volumes:
  - /path/to/custom-ca.crt:/etc/ssl/certs/custom-ca.crt:ro
```

After implementing this solution, connections to services with self-signed certificates should work properly.

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

## Authelia forward-auth not working

If you're using Authelia v4.39.15 or later with forward-auth and experiencing authentication issues (repeated login prompts or authorization errors), you may need to add `authn_strategies` to your Authelia configuration.

In your Authelia `configuration.yml`, update the forward-auth endpoint configuration:

```yaml
server:
  # ...
  endpoints:
    authz:
      forward-auth:
        implementation: 'ForwardAuth'
        authn_strategies:
          - name: 'CookieSession'
```

See [issue #1482](https://github.com/henrygd/beszel/issues/1482) for more details.
