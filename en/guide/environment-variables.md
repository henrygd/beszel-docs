# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | unset   | URL of the web UI. Must set if [serving at a subpath](./reverse-proxy).                                                                     |
| `AUTO_LOGIN`            | unset   | Email address of a user to automatically authenticate.                                                                                      |
| `CONTAINER_DETAILS`     | true    | Allow viewing container details (inspect, logs) in the web UI.       |
| `CSP`                   | unset   | Adds a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header with this value. |
| `DISABLE_PASSWORD_AUTH` | false   | Disables password authentication.                                                                                                           |
| `MFA_OTP`               | false   | Enables OTP authentication for users and/or superusers.        |
| `SHARE_ALL_SYSTEMS`     | false   | Allows access to all systems by all users.                                                                                                  |
| `TRUSTED_AUTH_HEADER`   | unset   | Trusted header for forwarded authentication.                                                                                                |
| `USER_CREATION`         | false   | Enables automatic user creation for OAuth2 / OIDC.                                                                                          |
| `USER_EMAIL`            | unset   | Create first user with this email.                                                                                                          |
| `USER_PASSWORD`         | unset   | Create first user with this password.                                                                                                       |

### `AUTO_LOGIN`

Don't set this unless you want to completely bypass authentication and use only one user account.

### `DISABLE_PASSWORD_AUTH`

This does not disable authentication entirely. It disables password login if you want to use OAuth instead.

### `MFA_OTP`

If `true`, multi-factor authentication (MFA) via email one-time password (OTP) will be enabled for users and superusers. If set to `superusers`, only superusers will be required to use OTP (when logging into PocketBase).

Do not enable this unless you've configured an SMTP server.

### `SHARE_ALL_SYSTEMS`

If true, systems will be visible to all users. Users can also edit or delete any system unless they are assigned the `readonly` role.

### `TRUSTED_AUTH_HEADER`

Don't set this unless you are implementing your own authentication and want to bypass the built-in authentication. The specified header should include the authenticated user's email.

For example, when using Cloudflare Access you might set `TRUSTED_AUTH_HEADER=Cf-Access-Authenticated-User-Email` because Cloudflare uses that header to provide the user email.

## Agent

Environment variables may optionally be prefixed with `BESZEL_AGENT_`.

| Name                | Default | Description                                                                                    |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `DATA_DIR`          | unset   | Persistent data directory.                                                                     |
| `DOCKER_HOST`       | unset   | Overrides the Docker host (docker.sock).                                                       |
| `EXCLUDE_CONTAINERS` | unset   | Exclude containers from being monitored.                                                    |
| `EXCLUDE_SMART` | unset   | Exclude S.M.A.R.T. devices from being monitored.                                                    |
| `EXTRA_FILESYSTEMS` | unset   | Monitor extra disks if using binary. See [Additional Disks](./additional-disks).               |
| `FILESYSTEM`        | unset   | Device, partition, or mount point to use for root disk stats.                                  |
| `HUB_URL`           | unset   | URL of the hub.                                                                                |
| `INTEL_GPU_DEVICE`  | unset   | Specify `-d` value for `intel_gpu_top`. See [Intel GPU](./gpu.md#intel). |
| `KEY`               | unset   | Public SSH key(s) to use for authentication. Provided in hub.                                  |
| `KEY_FILE`          | unset   | Read public keys from a file instead of an environment variable.                               |
| `LHM`               | false   | Use LibreHardwareMonitor for Windows sensors.                                                  |
| `LISTEN`            | 45876   | Port or host:port to listen on.                                                                |
| `LOG_LEVEL`         | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                 |
| `MEM_CALC`          | unset   | Overrides the default memory calculation.                                                      |
| `NETWORK`           | unset   | Network for listener. "tcp", "tcp4", "tcp6", or "unix".                                        |
| `NICS`              | unset   | Whitelist or blacklist network interfaces.                                                     |
| `PRIMARY_SENSOR`    | unset   | Display specific temperature sensor in 'All Systems' table.                                    |
| `SENSORS`           | unset   | Whitelist or blacklist temperature sensors.                                                    |
| `SERVICE_PATTERNS`  | unset   | List of systemd service patterns to monitor.                                                      |
| `SKIP_GPU`          | false   | Disable GPU monitoring.                                                                        |
| `SMART_DEVICES`     | unset   | List of S.M.A.R.T. devices to monitor.                                                        |
| `SYS_SENSORS`       | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160). |
| `SYSTEM_NAME`       | unset   | Override system name on universal token registration. Defaults to hostname if unset.           |
| `TOKEN`             | unset   | WebSocket registration token. Provided in hub.                                                 |
| `TOKEN_FILE`        | unset   | Read token from a file instead of an environment variable.                                     |


### `DATA_DIR`

Attempts to find a suitable directory if unset. Currently only used to store the system fingerprint, but may be used in the future for a SQLite database. The fingerprint is deterministic, so in most cases you can ignore warnings if no directory is found.

### `DOCKER_HOST`

If using a proxy, Beszel only needs access to read container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

You may also set this to an empty string (`DOCKER_HOST=""`) to completely disable Docker monitoring.

### `KEY` / `KEY_FILE`

Multiple keys can be provided if they are separated by newlines. You can also leave comments by starting the line with `#`.

### `LHM`

Windows only. The agent includes [LibreHardwareMonitorLib](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) for detecting temperature sensors. To use, set `LHM=true` and run the agent as administrator.

### `LISTEN`

The host must be a literal IP address or full path to a unix socket. If it is an IPv6 address it must be enclosed in square brackets, as in `[2001:db8::1]:45876`.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.

### `NETWORK`

Default depends on the address value. If the address starts with `/`, it is treated as a unix socket. Otherwise, `tcp` is used.

### `NICS`

Treated as a whitelist by default. Can be used as a blacklist by prefixing with `-`.

| `NICS` value   | Mode      | Action                                                    |
| -------------- | --------- | --------------------------------------------------------- |
| `foo_*`        | Whitelist | Only interfaces matching `foo_*` are allowed.             |
| `foo_1,bar_*`  | Whitelist | Only `foo_1` and `bar_*` interfaces allowed.              |
| `-foo_*`       | Blacklist | Excludes interfaces matching `foo_*`; all others allowed. |
| `-foo_1,bar_*` | Blacklist | Excludes `foo_1` and `bar_*`; all others allowed.         |
| `""`           | Disabled  | Disable network monitoring with an empty string.          |

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


### `SERVICE_PATTERNS`

Comma-separated list of glob patterns to match systemd service names. Services matching any of the patterns will be monitored. Others will be ignored.

```dotenv
SERVICE_PATTERNS="beszel*,docker*,kubelet*"
```

### `SMART_DEVICES`

Used to override the devices detected by `smartctl --scan`. Each device is specified as a colon-separated pair of the device path and (optionally) the device type. For example:

```dotenv
SMART_DEVICES=/dev/nvme0:nvme,/dev/sda:sat
```

This does not need to be a full list and will be merged with other devices detected by `smartctl --scan`.


### `EXCLUDE_CONTAINERS`

Exclude containers from being monitored based on their name. Supports comma-separated patterns with wildcard matching using `*`.

Examples:

```bash
# Exclude specific containers by exact name
EXCLUDE_CONTAINERS="test-web,test-api"

# Exclude all containers starting with "test-"
EXCLUDE_CONTAINERS="test-*"

# Exclude all containers ending with "-staging"
EXCLUDE_CONTAINERS="*-staging"

# Exclude containers with pattern in the middle
EXCLUDE_CONTAINERS="*-temp-*"

# Multiple patterns (exclude test containers and staging containers)
EXCLUDE_CONTAINERS="test-*,*-staging,dev-*"
```

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
