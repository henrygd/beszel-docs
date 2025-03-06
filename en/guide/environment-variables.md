# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | unset   | URL of the web UI. Must set if [serving on a subpath](./serve-on-subpath).                                                                  |
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
| `LISTEN`            | 45876   | Port or host:port to listen on.                                                                |
| `LOG_LEVEL`         | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                 |
| `MEM_CALC`          | unset   | Overrides the default memory calculation.                                                      |
| `NETWORK`           | unset   | Network for listener. "tcp", "tcp4", "tcp6", or "unix".                                        |
| `NICS`              | unset   | Whitelist of network interfaces to monitor for bandwidth.                                      |
| `PRIMARY_SENSOR`    | unset   | Temperature sensor to use for dashboard temperature.                                           |
| `SENSORS`           | unset   | Whitelist of temperature sensors to monitor.                                                   |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |

### `LISTEN`

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

| Name   | Default | Description          |
| ------ | ------- | -------------------- |
| `PORT` | 45876   | Renamed to `LISTEN`. |

## Setting environment variables

### Docker

For Docker Compose, use the `environment` or `env_file` attributes in `docker-compose.yml` ([instructions](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)).

For `docker run`, use the `-e`, `--env`, or `--env-file` flags ([instructions](https://docs.docker.com/reference/cli/docker/container/run/#env)).

### Binary

If executing the binary directly, include the environment variables as command line arguments. For example: `MEM_CALC=htop ./beszel-agent`.

If using Systemd, the service configuration is usually located in `/etc/systemd/system/beszel-agent.service`. Edit env vars in the `[Service]` section, either directly with `Environment="KEY=VALUE"` or with an env file defined in `EnvironmentFile=PATH`.

Alternatively, you can create an override file for your modifications with `systemctl edit beszel` or `systemctl edit beszel-agent` ([instructions](https://docs.fedoraproject.org/en-US/quick-docs/systemd-understanding-and-administering/#_modifying_existing_systemd_services)).

After editing the service, reload the configuration and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # or beszel for the hub
```
