# Environment Variables

List values should be comma separated with no spaces. For example: `SENSORS=sensor_1,sensor_2`.

## Hub

Environment variables may optionally be prefixed with `BESZEL_HUB_`.

| Name                    | Default | Description                                                                                                                                 |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | unset   | URL of the hub, used for links in emails and notifications. Must set if [serving at a subpath](./reverse-proxy).                            |
| `AUTO_LOGIN`            | unset   | Email address of a user to automatically authenticate.                                                                                      |
| `CHECK_UPDATES`         | false   | Allow the hub to check for updates and show a notification.                                                                                 |
| `CONTAINER_DETAILS`     | true    | Allow viewing container details (inspect, logs) in the web UI.                                                                              |
| `CSP`                   | unset   | Adds a [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) header with this value. |
| `DISABLE_PASSWORD_AUTH` | false   | Disables password authentication.                                                                                                           |
| `HEARTBEAT_INTERVAL`    | `60`    | Seconds between heartbeat pings. Has no effect if `HEARTBEAT_URL` is unset.                                                                 |
| `HEARTBEAT_METHOD`      | `POST`  | HTTP method for heartbeat pings. Valid values: `GET`, `POST`, `HEAD`.                                                                        |
| `HEARTBEAT_URL`         | unset   | External URL to ping periodically. Enables [heartbeat monitoring](#heartbeat-monitoring). Feature is disabled if empty.                      |
| `MFA_OTP`               | false   | Enables OTP authentication for users and/or superusers.                                                                                     |
| `OAUTH_DISABLE_POPUP`   | false   | Disables the OAuth2 popup window. Useful when OAuth is used behind a reverse proxy or in embedded browser environments.                      |
| `SHARE_ALL_SYSTEMS`     | false   | Allows access to all systems by all users. Users can also edit or delete any system unless they are assigned the `readonly` role.            |
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

### `OAUTH_DISABLE_POPUP`

When set to `true`, the OAuth2 login flow opens in the same window instead of a popup. Set this if your reverse proxy or browser environment blocks popup windows.

The redirect flow requires users to register their app's base URL (e.g., `https://beszel.example.com`) as an additional OAuth redirect URI in their provider settings, alongside the existing `{url}/api/oauth2-redirect` entry.

### Heartbeat monitoring

If set via environment variables, these values take precedence and the settings page becomes read-only.

When `HEARTBEAT_URL` is set, Beszel sends a periodic outbound ping to the specified URL (e.g., a [Healthchecks.io](https://healthchecks.io), [BetterStack](https://betterstack.com), or [Uptime Kuma](https://github.com/louislam/uptime-kuma) endpoint). This lets you monitor the health of your Beszel instance itself using a dead man's switch approach — if pings stop arriving, the external service alerts you.

When using the default `POST` method, Beszel sends a JSON payload with a summary of the current state:

```json
{
  "status": "error",
  "timestamp": "2026-02-20T14:30:00Z",
  "msg": "1 system(s) down: Production-DB",
  "systems": {
    "total": 5,
    "up": 3,
    "down": 1,
    "paused": 1,
    "pending": 0
  },
  "down_systems": [
    {
      "id": "abc123def456",
      "name": "Production DB",
      "host": "db.example.com"
    }
  ],
  "triggered_alerts": [
    {
      "system_id": "xyz789ghi012",
      "system_name": "Web Server 01",
      "alert_name": "CPU",
      "threshold": 80
    }
  ],
  "beszel_version": "0.18.4"
}
```

Use `GET` or `HEAD` for services that only require a simple ping request without a body.

### `TRUSTED_AUTH_HEADER`

Don't set this unless you are implementing your own authentication and want to bypass the built-in authentication. The specified header should include the authenticated user's email.

For example, when using Cloudflare Access you might set `TRUSTED_AUTH_HEADER=Cf-Access-Authenticated-User-Email` because Cloudflare uses that header to provide the user email.

## Agent

Environment variables may optionally be prefixed with `BESZEL_AGENT_`.

`Since` shows the first Beszel release where the variable is mentioned in the public release notes.

| Name                      | Default | Description                                                                                          | Since |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------------------- | ----- |
| `ALL_PROXY`               | unset   | SOCKS5 proxy for the agent's outbound WebSocket connection to the hub. | - |
| `AMD_SYSFS`               | false   | Use AMD sysfs interface instead of `rocm-smi` for AMD GPU data. Deprecated; use `GPU_COLLECTOR` instead.                                    | - |
| `CA_CERT_FILE`            | unset   | Set to a PEM certificate file if hub uses private or self-signed CA.                                 | 0.19.0 |
| `DATA_DIR`                | unset   | Persistent data directory.                                                                           | - |
| `DISABLE_SSH`             | false   | Disable the SSH server completely (WebSocket connection only).                                       | 0.18.4 |
| `DISK_USAGE_CACHE`        | unset   | Provide a duration like `5m` or `1h` to cache usage of extra disks and avoid waking them to recheck. | 0.17.0 |
| `DOCKER_HOST`             | unset   | Overrides the Docker host (docker.sock).                                                             | - |
| `DOCKER_TIMEOUT`          | `2100ms`| Overrides the Docker API call timeout. Accepts Go duration format (e.g. `5s`, `2100ms`).            | - |
| `EXCLUDE_CONTAINERS`      | unset   | Exclude containers from being monitored.                                                             | 0.15.3 |
| `EXCLUDE_SMART`           | unset   | Exclude S.M.A.R.T. devices from being monitored.                                                     | 0.16.0 |
| `EXIT_ON_DNS_ERROR`       | false   | Exit the agent instead of retrying when a DNS lookup failure occurs on the hub connection.           | - |
| `EXTRA_FILESYSTEMS`       | unset   | Monitor extra disks if using binary. See [Additional Disks](./additional-disks).                     | - |
| `FILESYSTEM`              | unset   | Device, partition, or mount point to use for root disk stats.                                        | - |
| `GPU_COLLECTOR`           | unset   | Ordered comma-separated list of GPU collectors. Overrides auto-detection. See [`GPU_COLLECTOR`](#gpu-collector). | - |
| `HUB_URL`                 | unset   | URL of the hub.                                                                                      | - |
| `INTEL_GPU_DEVICE`        | unset   | Specify `-d` value for `intel_gpu_top`. See [Intel GPU](./gpu.md#intel).                             | 0.15.3 |
| `KEY`                     | unset   | Public SSH key(s) to use for authentication. Provided in hub.                                        | - |
| `KEY_FILE`                | unset   | Read public keys from a file instead of an environment variable.                                     | - |
| `LHM`                     | false   | Use LibreHardwareMonitor for Windows sensors.                                                        | 0.12.7 |
| `LISTEN`                  | 45876   | Port or host:port to listen on.                                                                      | - |
| `LOG_LEVEL`               | info    | Logging level. Valid values: "debug", "info", "warn", "error".                                       | - |
| `MEM_CALC`                | unset   | Overrides the default memory calculation.                                                            | - |
| `NETWORK`                 | unset   | Network for listener. "tcp", "tcp4", "tcp6", or "unix".                                              | - |
| `NICS`                    | unset   | Whitelist or blacklist network interfaces.                                                           | 0.12.11 |
| `NVML`                    | false   | Use experimental NVML integration for GPU monitoring.                                                | - |
| `PRIMARY_SENSOR`          | unset   | Display specific temperature sensor in 'All Systems' table.                                          | - |
| `SENSORS`                 | unset   | Whitelist or blacklist temperature sensors.                                                          | - |
| `SENSORS_TIMEOUT`         | 2s      | Duration to customize the temperature collection timeout.                                            | 0.18.7 |
| `SERVICE_PATTERNS`        | unset   | List of systemd service patterns to monitor.                                                         | 0.18.5 |
| `SKIP_GPU`                | false   | Disable GPU monitoring.                                                                              | 0.12.12 |
| `SKIP_SYSTEMD`            | false   | Disable Systemd service monitoring.                                                                  | 0.17.0 |
| `SMART_DEVICES`           | unset   | List of S.M.A.R.T. devices to monitor.                                                               | 0.15.1 |
| `SMART_DEVICES_SEPARATOR` | ,       | Separator used to split `SMART_DEVICES`                                                              | 0.18.3 |
| `SMART_INTERVAL`          | 1h      | Interval to check S.M.A.R.T. devices.                                                                | 0.18.0 |
| `SYS_SENSORS`             | unset   | Overrides sys path for sensors. See [#160](https://github.com/henrygd/beszel/discussions/160).       | - |
| `SYSTEM_NAME`             | unset   | Override system name on universal token registration. Defaults to hostname if unset.                 | 0.13.0 |
| `TOKEN`                   | unset   | WebSocket registration token. Provided in hub.                                                       | - |
| `TOKEN_FILE`              | unset   | Read token from a file instead of an environment variable.                                       | - |
| `ZFS_INTERVAL`            | 1h      | Interval to refresh ZFS pool details (scrub, vdevs, datasets).                                    | - |

### `ALL_PROXY`

Routes the agent's outbound WebSocket connection to the hub through a SOCKS5 proxy. Only `socks5://` and `socks5h://` schemes are supported (`socks5h` resolves DNS on the proxy side).

Example: `ALL_PROXY=socks5h://proxy.example.com:1080`

### `AMD_SYSFS`

Deprecated in favor of `GPU_COLLECTOR`. When set to `true`, uses the AMD sysfs interface for GPU data collection instead of `rocm-smi`. Set `GPU_COLLECTOR=amd_sysfs` for equivalent behavior.

### `CA_CERT_FILE`

Agent-to-hub HTTPS connections use standard certificate and hostname verification. Public certificates trusted by the operating system require no additional configuration.

For hubs using a private or self-signed CA, set CA_CERT_FILE to a PEM certificate file:

```yaml
services:
  beszel-agent:
    volumes:
      - ./hub-ca.crt:/etc/beszel/hub-ca.crt:ro
    environment:
      HUB_URL: https://hub.internal.example
      CA_CERT_FILE: /etc/beszel/hub-ca.crt
```

The file may contain one or more CA certificates. These are added to the system trust store, so publicly trusted certificates continue to work.

The certificate must include a Subject Alternative Name (SAN) matching the hostname in HUB_URL. Missing, unreadable, empty, or malformed files prevent the agent from starting.

### `DATA_DIR`

Attempts to find a suitable directory if unset. Currently only used to store the system fingerprint, but may be used in the future for a SQLite database. The fingerprint is deterministic, so in most cases you can ignore warnings if no directory is found.

### `DOCKER_HOST`

Docker socket proxies provide a more secure alternative to a direct `docker.sock` connection by filtering API requests. Beszel only needs read access to container information. For [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) you would set `CONTAINERS=1`.

You may also set this to an empty string (`DOCKER_HOST=""`) to completely disable Docker monitoring.

### `DOCKER_TIMEOUT`

Overrides the default Docker API call timeout of `2100ms`. Accepts any Go duration string (e.g. `5s`, `500ms`). Increase this if you see Docker-related timeouts on slow systems.

### `EXIT_ON_DNS_ERROR`

When set to `true`, the agent exits immediately on a DNS lookup failure instead of retrying the connection. Useful in environments where a DNS failure indicates a permanent misconfiguration rather than a transient network issue.

### `GPU_COLLECTOR` {#gpu-collector}

Comma-separated list of collectors to try in order. Overrides the default auto-detection priority. Valid values:

| Value           | Description                                      |
| --------------- | ------------------------------------------------ |
| `nvtop`         | nvtop (multi-vendor)                             |
| `nvml`          | NVIDIA Management Library (requires `NVML=true`) |
| `nvidia-smi`    | NVIDIA System Management Interface               |
| `intel_sysfs`   | Intel sysfs interface                            |
| `intel_gpu_top` | Intel GPU top                                    |
| `amd_sysfs`     | AMD sysfs interface                              |
| `rocm-smi`      | AMD ROCm System Management Interface             |
| `macmon`        | macmon (Apple Silicon)                           |
| `powermetrics`  | powermetrics (macOS)                             |

Example: `GPU_COLLECTOR=nvml,nvidia-smi` tries NVML first, falling back to nvidia-smi.

### `KEY` / `KEY_FILE`

Multiple keys can be provided if they are separated by newlines. You can also leave comments by starting the line with `#`.

### `LHM`

Windows only. The agent includes [LibreHardwareMonitorLib](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) for detecting temperature sensors.

To use, set `LHM=true` and make sure [PawnIO](https://pawnio.eu/) is installed. If your sensors don't show up, try running the agent as administrator.

### `LISTEN`

The host must be a literal IP address or full path to a unix socket. If it is an IPv6 address it must be enclosed in square brackets, as in `[2001:db8::1]:45876`.

### `MEM_CALC`

The default value for used memory is based on gopsutil's [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) calculation, which should align fairly closely with `free`. Set `MEM_CALC` to `htop` to align with htop's calculation.

### `NETWORK`

Default depends on the address value. If the address starts with `/`, it is treated as a unix socket. Otherwise, `tcp` is used.

### `NICS`

Treated as a whitelist by default. Can be used as a blacklist by prefixing with `-`.

| `NICS` value   | Mode      | Action                                                    |
| --------------- | --------- | --------------------------------------------------------- |
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
| `foo_1,bar_*`   | Whitelist | Only sensors matching `foo_1` and `bar_*` are allowed. |
| `-foo_*`        | Blacklist | Excludes sensors matching `foo_*`; all others allowed. |
| `-foo_1,bar_*` | Blacklist | Excludes `foo_1` and `bar_*`; all others allowed.      |
| `""`           | Disabled  | Disable temperature monitoring with an empty string.   |

### `SERVICE_PATTERNS`

Comma-separated list of glob patterns to match systemd service names. Services matching any of the patterns will be monitored. Others will be ignored.

```dotenv
SERVICE_PATTERNS="beszel*,docker*,kubelet*"
```

<!-- Only matched services are eligible to trigger the [Failed Services alert](./systemd.md#alerts). -->

### `SMART_DEVICES`

Used to override the devices detected by `smartctl --scan`. Each device is specified as a colon-separated pair of the device path and (optionally) the device type. For example:

```dotenv
SMART_DEVICES=/dev/nvme0:nvme,/dev/sda:sat
```

This does not need to be a full list and will be merged with other devices detected by `smartctl --scan`. Unless it is set to an empty string, in which case SMART monitoring will be disabled entirely.

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

You can also use `KEY_FILE` and `TOKEN_FILE` to load secrets from protected files (see [issue #1627](https://github.com/henrygd/beszel/issues/1627)).

After editing the service, reload the configuration and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # or beszel for the hub
```

### Binary direct execution

Include the environment variables as command line arguments. For example: `MEM_CALC=htop ./beszel-agent`.