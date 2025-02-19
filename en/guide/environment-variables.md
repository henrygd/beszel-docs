# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | unset   | URL of the web UI. Must set if serving from a subpath.                                                                                           |
| `CSP`                   | unset   | Adds a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header with this value. |
| `DISABLE_PASSWORD_AUTH` | false   | Disables password authentication.                                                                                                           |
| `USER_CREATION`         | false   | Enables automatic user creation for OAuth2 / OIDC.                                                                                          |

## Agent

Environment variables may optionally be prefixed with `BESZEL_AGENT_`.

| Name                | Default | Description                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `ADDR`              | 45876   | Port or host:port to listen on.                                                             |
| `DOCKER_HOST`       | unset   | Overrides the docker host (docker.sock) if using a proxy.                                      |
| `EXTRA_FILESYSTEMS` | unset   | Monitor extra disks if using binary. See [Additional Disks](./additional-disks).               |
| `FILESYSTEM`        | unset   | Device, partition, or mount point to use for root disk stats.                                  |
| `KEY`               | unset   | Public SSH key to use for authentication. Provided in hub.                                     |
| `KEY_FILE`          | unset   | Read public key from a file instead of an environment variable.                                |
| `LOG_LEVEL`         | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                 |
| `MEM_CALC`          | unset   | Overrides the default memory calculation.                                                      |
| `NETWORK`           | unset   | Network for listener. "tcp", "tcp4", "tcp6", or "unix".                                        |
| `NICS`              | unset   | Whitelist of network interfaces to monitor for bandwidth.                                      |
| `PRIMARY_SENSOR`    | unset   | Temperature sensor to use for dashboard temperature.                                           |
| `SENSORS`           | unset   | Whitelist of temperature sensors to monitor.                                                   |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |

### `ADDR`

The host must be a literal IP address or full path to a unix socket. If it is an IPv6 address it must be enclosed in square brackets, as in `[2001:db8::1]:45876`.

### `DOCKER_HOST`

Beszel only needs access to read container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

### `NETWORK`

Default depends on the address value. If the address starts with `/`, it is treated as a unix socket. Otherwise, `tcp` is used.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.

### `PRIMARY_SENSOR`

The highest temperature will be used if a specific sensor is not defined.

### `SENSORS`

Set to an empty string (`SENSORS=""`) to disable temperature monitoring.

## Deprecations

These variables are deprecated but will remain for backward compatibility.

| Name   | Default | Description        |
| ------ | ------- | ------------------ |
| `PORT` | 45876   | Renamed to `ADDR`. |
