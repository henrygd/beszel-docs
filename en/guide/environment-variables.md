# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | unset   | URL of the web UI. Must set if [serving on a subpath](./serve-on-subpath).                                                                  |
| `CSP`                   | unset   | Adds a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header with this value. |
| `DISABLE_PASSWORD_AUTH` | false   | Disables password authentication.                                                                                                           |
| `SHARE_ALL_SYSTEMS`     | false   | Allows access to all systems by all users.                                                                                                  |
| `USER_CREATION`         | false   | Enables automatic user creation for OAuth2 / OIDC.                                                                                          |

### `DISABLE_PASSWORD_AUTH`

This does not disable authentication entirely. It disables password login if you want to use OAuth instead.

### `SHARE_ALL_SYSTEMS`

If true, systems will be visible to all users. Users can also edit or delete any system unless they are assigned the `readonly` role.

## Agent

Environment variables may optionally be prefixed with `BESZEL_AGENT_`.

| Name                | Default | Description                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `DOCKER_HOST`       | unset   | Overrides the Docker host (docker.sock).                                                       |
| `EXTRA_FILESYSTEMS` | unset   | Monitor extra disks if using binary. See [Additional Disks](./additional-disks).               |
| `FILESYSTEM`        | unset   | Device, partition, or mount point to use for root disk stats.                                  |
| `HUB_URL`           | unset   | URL of the hub.                                                                                |
| `KEY`               | unset   | Public SSH key(s) to use for authentication. Provided in hub.                                  |
| `KEY_FILE`          | unset   | Read public keys from a file instead of an environment variable.                               |
| `LISTEN`            | 45876   | Port or host:port to listen on.                                                                |
| `LOG_LEVEL`         | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                 |
| `MEM_CALC`          | unset   | Overrides the default memory calculation.                                                      |
| `NETWORK`           | unset   | Network for listener. "tcp", "tcp4", "tcp6", or "unix".                                        |
| `NICS`              | unset   | Whitelist of network interfaces to monitor for bandwidth.                                      |
| `PRIMARY_SENSOR`    | unset   | Display specific temperature sensor in 'All Systems' table.                                    |
| `SENSORS`           | unset   | Whitelist or blacklist temperature sensors.                                                    |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |
| `TOKEN`             | unset   | WebSocket registration token. Provided in hub.                                              |

### `DOCKER_HOST`

If using a proxy, Beszel only needs access to read container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

You may also set this to an empty string (`DOCKER_HOST=""`) to completely disable Docker monitoring.

### `KEY` / `KEY_FILE`

Multiple keys can be provided if they are separated by newlines. You can also leave comments by starting the line with `#`.

### `LISTEN`

The host must be a literal IP address or full path to a unix socket. If it is an IPv6 address it must be enclosed in square brackets, as in `[2001:db8::1]:45876`.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.

### `NETWORK`

Default depends on the address value. If the address starts with `/`, it is treated as a unix socket. Otherwise, `tcp` is used.

### `PRIMARY_SENSOR`

The highest temperature will be used if a specific sensor is not defined.

### `SENSORS`

Treated as a whitelist by default. Can be used as a blacklist by prefixing with `-`.

| `SENSORS` value | Mode      | Action                                                 |
| --------------- | --------- | ------------------------------------------------------ |
| `foo_*`         | Whitelist | Only sensors matching `foo_*` are allowed.             |
| `foo_1,bar_*`   | Whitelist | Only `foo_1` and `bar_*` sensors allowed.              |
| `-foo_*`        | Blacklist | Excludes sensors matching `foo_*`; all others allowed. |
| `-foo_1,bar_*`  | Blacklist | Excludes `foo_1` and `bar_*`; all others allowed.      |
| `""`            | Disabled  | Disable temperature monitoring with an empty string.   |

## Deprecations

These variables are deprecated but will remain for backward compatibility.

| Name   | Default | Description          |
| ------ | ------- | -------------------- |
| `PORT` | 45876   | Renamed to `LISTEN`. |

## Setting environment variables

### Docker

For Docker Compose, use the `environment` or `env_file` attributes in `docker-compose.yml` ([instructions](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)).

For `docker run`, use the `-e`, `--env`, or `--env-file` flags ([instructions](https://docs.docker.com/reference/cli/docker/container/run/#env)).

### Windows

Edit the service in NSSM by running the command below. Scroll to the right in the GUI to find environment variables.

```powershell
nssm edit beszel-agent
```

You can also change options directly from the command line:

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:"
```

Restart the service when finished: `nssm restart beszel-agent`

### Homebrew

Environment variables can be changed in `~/.config/beszel/beszel-agent.env`.

Restart the service after editing: `brew services restart beszel-agent`

### Systemd

The service configuration is usually located in `/etc/systemd/system/beszel-agent.service`. Edit env vars in the `[Service]` section, either directly with `Environment="KEY=VALUE"` or with an env file defined in `EnvironmentFile=PATH`.

Alternatively, you can create an override file for your modifications with `systemctl edit beszel` or `systemctl edit beszel-agent` ([instructions](https://docs.fedoraproject.org/en-US/quick-docs/systemd-understanding-and-administering/#_modifying_existing_systemd_services)).

After editing the service, reload the configuration and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # or beszel for the hub
```

### Binary direct execution

Include the environment variables as command line arguments. For example: `MEM_CALC=htop ./beszel-agent`.
