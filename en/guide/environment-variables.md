# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

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
| `SENSORS`           | unset   | Whitelist of temperature sensors to monitor.                                                   |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |

### `DOCKER_HOST`

Beszel only needs access to read container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.

### `SENSORS`

Set to an empty string (`SENSORS=""`) to disable temperature monitoring.

## Setting environment variables

### Docker
For Docker Compose, use the `environment` or `env_file` attributes in `docker-compose.yml` ([instructions](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)).

For `docker run`, use the `-e`, `--env`, or `--env-file` flags ([instructions](https://docs.docker.com/reference/cli/docker/container/run/#env)).

### Binary

If executing the binary directly, include the environment variables as command line arguments. For example: `KEY="..." PORT=45876 ./beszel-agent`.

If using Systemd, the service configuration is usually located in `/etc/systemd/system/beszel-agent.service`. Edit env vars in the `[Service]` section, either directly with `Environment="KEY=VALUE"` or with an env file defined in `EnvironmentFile=PATH`.

Alternatively, you can create an override file for your modifications with `systemctl edit beszel` or `systemctl edit beszel-agent` ([instructions](https://docs.fedoraproject.org/en-US/quick-docs/systemd-understanding-and-administering/#_modifying_existing_systemd_services)).

After editing the service, reload the configuration and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # or beszel for the hub
```
