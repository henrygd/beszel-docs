# Environment Variables

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `CSP`                   | unset   | Adds a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header with this value. |
| `DISABLE_PASSWORD_AUTH` | false   | Disables password authentication.                                                                                                           |
| `USER_CREATION`         | false   | Enables automatic user creation for OAuth2 / OIDC.                                                                                          |

## Agent

Environment variables may optionally be prefixed with `BESZEL_AGENT_`.

| Name                | Default | Description                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `DOCKER_HOST`       | unset   | Overrides the docker host (docker.sock) if using a proxy.                                      |
| `EXTRA_FILESYSTEMS` | unset   | Monitor extra disks if using binary. See [Additional Disks](./additional-disks).               |
| `FILESYSTEM`        | unset   | Device, partition, or mount point to use for root disk stats.                                  |
| `KEY`               | unset   | Public SSH key to use for authentication. Provided in hub.                                     |
| `KEY_FILE`          | unset   | Read public key from a file instead of an environment variable.                                |
| `LOG_LEVEL`         | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                 |
| `MEM_CALC`          | unset   | Overrides the default memory calculation.                                                      |
| `NICS`              | unset   | Whitelist of network interfaces to monitor for bandwidth.                                      |
| `PORT`              | 45876   | Port or address:port to listen on.                                                             |
| `PRIMARY_SENSOR`    | unset   | Temperature sensor to use for dashboard temperature.                                           |
| `SENSORS`           | unset   | Whitelist of temperature sensors to monitor.                                                   |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |

### `PRIMARY_SENSOR`

The highest temperature will be used if a specific sensor is not defined.

### `DOCKER_HOST`

Beszel only needs access to read container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.
