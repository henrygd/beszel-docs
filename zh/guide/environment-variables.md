# 环境变量

列表值应以逗号分隔且不带空格。例如：`SENSORS=sensor_1,sensor_2`。

## 中心 (Hub)

环境变量可以选择性地以 `BESZEL_HUB_` 作为前缀。

| 名称                    | 默认值 | 描述                                                                                                                             |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | 未设置 | 中心的 URL，用于电子邮件和通知中的链接。如果 [从子路径提供服务](./reverse-proxy)，则必须设置。                                   |
| `AUTO_LOGIN`            | 未设置 | 自动认证的用户邮箱。                                                                                                             |
| `CHECK_UPDATES`         | false  | 允许中心检查更新并显示通知。                                                                                                     |
| `CONTAINER_DETAILS`     | true   | 允许在 Web 界面中查看容器详情（inspect, logs）。                                                                                 |
| `CSP`                   | 未设置 | 添加具有此值的 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 头。 |
| `DISABLE_PASSWORD_AUTH` | false  | 禁用密码认证。                                                                                                                   |
| `HEARTBEAT_INTERVAL`    | `60`   | 心跳 ping 之间的间隔秒数。若未设置 `HEARTBEAT_URL` 则无效。                                                                     |
| `HEARTBEAT_METHOD`      | `POST` | 心跳 ping 使用的 HTTP 方法。有效值：`GET`、`POST`、`HEAD`。                                                                     |
| `HEARTBEAT_URL`         | 未设置 | 定期 ping 的外部 URL。启用[心跳监控](#heartbeat-monitoring)。为空时禁用此功能。                                                  |
| `MFA_OTP`               | false  | 为用户和/或超级用户启用 OTP 认证。                                                                                               |
| `OAUTH_DISABLE_POPUP`   | false  | 禁用 OAuth2 弹出窗口。适用于反向代理或嵌入式浏览器环境中使用 OAuth 的场景。                                                      |
| `SHARE_ALL_SYSTEMS`     | false  | 允许所有用户访问所有系统。                                                                                                       |
| `TRUSTED_AUTH_HEADER`   | 未设置 | 用于转发身份验证的可信头。                                                                                                       |
| `USER_CREATION`         | false  | 启用 OAuth2 / OIDC 的自动用户创建。                                                                                              |
| `USER_EMAIL`            | 未设置 | 使用此邮箱创建第一个用户。                                                                                                       |
| `USER_PASSWORD`         | 未设置 | 使用此密码创建第一个用户。                                                                                                       |

### `AUTO_LOGIN`

不要设置此选项，除非您想要完全绕过身份验证并使用一个用户账户。

### `DISABLE_PASSWORD_AUTH`

这不会完全禁用身份验证。如果您想使用 OAuth 代替密码登录，它会禁用密码登录。

### `MFA_OTP`

如果为 `true`，将为用户和超级用户启用通过电子邮件一次性密码 (OTP) 的多因素认证 (MFA)。如果设置为 `superusers`，只有超级用户需要使用 OTP（登录 PocketBase 时）。

除非您已配置 SMTP 服务器，否则不要启用此功能。

### `SHARE_ALL_SYSTEMS`

如果为 true，所有用户都可以看到系统。除非用户被分配了 `readonly` 角色，否则他们还可以编辑或删除任何系统。

### `OAUTH_DISABLE_POPUP`

设置为 `true` 时，OAuth2 登录流程将在同一窗口中打开，而非弹出窗口。当反向代理或浏览器环境阻止弹出窗口时，请设置此选项。

重定向流程要求用户在提供商的设置中，将应用的基础 URL（例如 `https://beszel.example.com`）注册为额外的 OAuth 重定向 URI，与现有的 `{url}/api/oauth2-redirect` 条目并列。

### 心跳监控 {#heartbeat-monitoring}

若通过环境变量设置，这些值优先生效，且设置页面将变为只读。

设置 `HEARTBEAT_URL` 后，Beszel 会定期向指定 URL 发送出站 ping（例如 [Healthchecks.io](https://healthchecks.io)、[BetterStack](https://betterstack.com) 或 [Uptime Kuma](https://github.com/louislam/uptime-kuma) 端点）。这让您可以通过"死人开关"方式监控 Beszel 实例自身的健康状态——若 ping 停止到达，外部服务将向您发出警报。

使用默认的 `POST` 方法时，Beszel 会发送包含当前状态摘要的 JSON 负载：

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

对于仅需要简单 ping 请求而无需请求体的服务，请使用 `GET` 或 `HEAD`。

### `TRUSTED_AUTH_HEADER`

除非您正在实现自己的身份验证并希望绕过内置身份验证，否则不要设置此选项。指定的头应包含已认证用户的电子邮件。例如，当使用 Cloudflare Access 时，您可能会设置 `TRUSTED_AUTH_HEADER=Cf-Access-Authenticated-User-Email`，因为 Cloudflare 使用该头来提供用户电子邮件。

## 代理 (Agent)

环境变量可以选择性地以 `BESZEL_AGENT_` 作为前缀。

| 名称                      | 默认值 | 描述                                                                                         | Since |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------- | ----- |
| `ALL_PROXY`               | 未设置 | 代理出站 WebSocket 连接至中心的 SOCKS5 代理。                                                                                                 | - |
| `AMD_SYSFS`               | false  | 使用 AMD sysfs 接口代替 `rocm-smi` 获取 AMD GPU 数据。已弃用，请改用 `GPU_COLLECTOR`。                                                     | - |
| `DATA_DIR`                | 未设置 | 持久数据目录。                                                                               | - |
| `DISABLE_SSH`             | false  | 禁用 SSH 服务器（仅 WebSocket 连接）。                                                         | 0.18.4 |
| `DISK_USAGE_CACHE`        | 未设置 | 提供类似 `5m` 或 `1h` 的持续时间来缓存额外磁盘的使用情况，避免唤醒它们进行重新检查。         | 0.17.0 |
| `DOCKER_HOST`             | 未设置 | 覆盖 Docker 主机 (docker.sock)。                                                             | - |
| `DOCKER_TIMEOUT`          | `2100ms`| 覆盖 Docker API 调用超时。接受 Go 时长格式（如 `5s`、`2100ms`）。                     | - |
| `EXCLUDE_CONTAINERS`      | 未设置 | 排除容器不被监控。                                                                           | 0.15.3 |
| `EXCLUDE_SMART`           | 未设置 | 排除 S.M.A.R.T. 设备不被监控。                                                               | 0.16.0 |
| `EXIT_ON_DNS_ERROR`       | false  | 发生 DNS 查询失败时退出代理，而非重试连接。                                              | - |
| `EXTRA_FILESYSTEMS`       | 未设置 | 如果使用二进制文件，则监控额外的磁盘。请参阅 [其他磁盘](./additional-disks.md)。             | - |
| `FILESYSTEM`              | 未设置 | 用于根磁盘统计的设备、分区或挂载点。                                                         | - |
| `GPU_COLLECTOR`           | 未设置 | 按优先级排列的 GPU 采集器逗号分隔列表，覆盖自动检测。详见 [`GPU_COLLECTOR`](#gpu-collector)。 | - |
| `HUB_URL`                 | 未设置 | 中心的 URL。                                                                                 | - |
| `INTEL_GPU_DEVICE`        | 未设置 | 指定 `intel_gpu_top` 的 `-d` 值。请参阅 [Intel GPU](./gpu.md#intel)。                        | 0.15.3 |
| `KEY`                     | 未设置 | 用于身份验证的公共 SSH 密钥（可多个）。在中心提供。                                          | - |
| `KEY_FILE`                | 未设置 | 从文件中读取公钥（可多个），而不是从环境变量中读取。                                         | - |
| `LHM`                     | false  | 为 Windows 传感器使用 LibreHardwareMonitor。                                                 | 0.12.7 |
| `LISTEN`                  | 45876  | 监听的端口或主机:端口。                                                                      | - |
| `LOG_LEVEL`               | info   | 日志级别。有效值: "debug", "info", "warn", "error"。                                         | - |
| `MEM_CALC`                | 未设置 | 覆盖默认内存计算。                                                                           | - |
| `NETWORK`                 | 未设置 | 监听器的网络类型。"tcp"、"tcp4"、"tcp6" 或 "unix"。                                          | - |
| `NICS`                    | 未设置 | 网络接口的白名单或黑名单。                                                                   | 0.12.11 |
| `NVML`                    | false  | 使用实验性 NVML 集成进行 GPU 监控。                                                          | - |
| `PRIMARY_SENSOR`          | 未设置 | 在"所有系统"表格中显示的特定温度传感器。                                                     | - |
| `SENSORS`                 | 未设置 | 温度传感器的白名单或黑名单。                                                                 | - |
| `SENSORS_TIMEOUT`         | 2s     | 用于自定义温度采集超时的持续时间。                                                           | 0.18.7 |
| `SERVICE_PATTERNS`        | 未设置 | 要监控的 systemd 服务模式列表。                                                              | 0.18.5 |
| `SKIP_GPU`                | false  | 禁用 GPU 监控。                                                                              | 0.12.12 |
| `SKIP_SYSTEMD`            | false  | 禁用 Systemd 服务监控。                                                                      | 0.17.0 |
| `SMART_DEVICES`           | 未设置 | 要监控的 S.M.A.R.T. 设备列表。                                                               | 0.15.1 |
| `SMART_DEVICES_SEPARATOR` | ,      | 用于分割 `SMART_DEVICES` 的分隔符                                                            | 0.18.3 |
| `SMART_INTERVAL`          | 1h     | 检查 S.M.A.R.T. 设备的间隔时间。                                                             | 0.18.0 |
| `SYS_SENSORS`             | 未设置 | 覆盖用于传感器的系统路径。请参阅 [#160](https://github.com/henrygd/beszel/discussions/160)。 | - |
| `SYSTEM_NAME`             | 未设置 | 在通用令牌注册时覆盖系统名称。未设置时默认为主机名。                                         | 0.13.0 |
| `TOKEN`                   | 未设置 | WebSocket 注册令牌。在中心提供。                                                             | - |
| `TOKEN_FILE`              | 未设置 | 从文件中读取令牌，而不是从环境变量中读取。                                                   | - |

### `ALL_PROXY`

将代理出站 WebSocket 连接路由通过 SOCKS5 代理。仅支持 `socks5://` 和 `socks5h://` 协议（`socks5h` 在代理端解析 DNS）。

示例：`ALL_PROXY=socks5h://proxy.example.com:1080`

### `AMD_SYSFS`

已弃用，请改用 `GPU_COLLECTOR`。设置为 `true` 时，使用 AMD sysfs 接口采集 GPU 数据，而非 `rocm-smi`。等效于设置 `GPU_COLLECTOR=amd_sysfs`。

### `DATA_DIR`

如果未设置，则尝试查找合适的目录。目前仅用于存储系统指纹，但将来可能用于 SQLite 数据库。指纹是确定性的，因此在大多数情况下，如果找不到目录，可以忽略警告。

### `DOCKER_HOST`

Docker 套接字代理通过过滤 API 请求，提供了比直接连接 `docker.sock` 更安全的选择。Beszel 只需要读取容器信息的权限。对于 [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy)，您需要设置 `CONTAINERS=1`．

您也可以将其设置为空字符串（`DOCKER_HOST=""`）以完全禁用 Docker 监控。

### `DOCKER_TIMEOUT`

覆盖默认 Docker API 调用超时（`2100ms`）。接受任意 Go 时长字符串（如 `5s`、`500ms`）。若在慢速系统上出现 Docker 超时，可适当增大此值。

### `EXIT_ON_DNS_ERROR`

设置为 `true` 时，代理在发生 DNS 查询失败时立即退出，而非重试连接。适用于 DNS 失败表示永久性配置错误而非临时网络问题的环境。

### `GPU_COLLECTOR` {#gpu-collector}

按优先级排列的采集器逗号分隔列表，覆盖默认自动检测顺序。有效值：

| 值               | 说明                                              |
| ---------------- | ------------------------------------------------- |
| `nvtop`          | nvtop（多厂商）                                   |
| `nvml`           | NVIDIA 管理库（需要 `NVML=true`）                 |
| `nvidia-smi`     | NVIDIA 系统管理接口                               |
| `intel_gpu_top`  | Intel GPU top                                     |
| `amd_sysfs`      | AMD sysfs 接口                                    |
| `rocm-smi`       | AMD ROCm 系统管理接口                             |
| `macmon`         | macmon（Apple Silicon）                           |
| `powermetrics`   | powermetrics（macOS）                             |

示例：`GPU_COLLECTOR=nvml,nvidia-smi` 优先尝试 NVML，失败时回退到 nvidia-smi。

### `KEY` / `KEY_FILE`

可以提供多个密钥，只需用换行符分隔。您也可以通过以 `#` 开头的行添加注释。

### `LHM`

仅限 Windows。代理程序包含 [LibreHardwareMonitorLib](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) 用于检测温度传感器。

要使用，请设置 `LHM=true` 并确保已安装 [PawnIO](https://pawnio.eu/)。如果您的传感器没有显示，请尝试以管理员身份运行代理程序。

### `LISTEN`

主机必须是一个字面量 IP 地址或 Unix 套接字的完整路径。如果是 IPv6 地址，则必须用方括号括起来，例如 `[2001:db8::1]:45876`。

### `MEM_CALC`

已用内存的默认值基于 gopsutil 的 [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) 计算，该计算应该与 `free` 非常接近。将 `MEM_CALC` 设置为 `htop` 以使其与 htop 的计算保持一致。

### `NETWORK`

默认值取决于地址值。如果地址以 `/` 开头，则视为 Unix 套接字。否则，使用 `tcp`。

### `NICS`

默认情况下作为白名单处理。可以通过在前面加上 `-` 作为黑名单使用。

| `NICS` 值      | 模式   | 操作                                        |
| -------------- | ------ | ------------------------------------------- |
| `foo_*`        | 白名单 | 只允许匹配 `foo_*` 的网络接口。             |
| `foo_1,bar_*`  | 白名单 | 只允许 `foo_1` 和 `bar_*` 网络接口。        |
| `-foo_*`       | 黑名单 | 排除匹配 `foo_*` 的网络接口；允许所有其他。 |
| `-foo_1,bar_*` | 黑名单 | 排除 `foo_1` 和 `bar_*`；允许所有其他。     |
| `""`           | 禁用   | 使用空字符串禁用网络监控。                  |

### `PRIMARY_SENSOR`

如果未定义特定传感器，则将使用最高温度。

### `SENSORS`

默认情况下作为白名单处理。可以通过在前面加上 `-` 作为黑名单使用。

| `SENSORS` 值   | 模式   | 操作                                      |
| -------------- | ------ | ----------------------------------------- |
| `foo_*`        | 白名单 | 只允许匹配 `foo_*` 的传感器。             |
| `foo_1,bar_*`  | 白名单 | 只允许 `foo_1` 和 `bar_*` 传感器。        |
| `-foo_*`       | 黑名单 | 排除匹配 `foo_*` 的传感器；允许所有其他。 |
| `-foo_1,bar_*` | 黑名单 | 排除 `foo_1` 和 `bar_*`；允许所有其他。   |
| `""`           | 禁用   | 使用空字符串禁用温度监控。                |

### `SERVICE_PATTERNS`

用于匹配 systemd 服务名称的逗号分隔的 glob 模式列表。匹配任何模式的服务将被监控。其他服务将被忽略。

```dotenv
SERVICE_PATTERNS="beszel*,docker*,kubelet*"
```

只有匹配的服务才有资格触发 [故障服务警报](./systemd.md#警报)。

### `SMART_DEVICES`

用于覆盖 `smartctl --scan` 检测到的设备。每个设备指定为冒号分隔的对，由设备路径和（可选的）设备类型组成。例如：

```dotenv
SMART_DEVICES=/dev/nvme0:nvme,/dev/sda:sat
```

这不需要是完整列表，将与 `smartctl --scan` 检测到的其他设备合并。除非它被设置为空字符串，在这种情况下将完全禁用 SMART 监控。

### `EXCLUDE_CONTAINERS`

根据容器名称排除不需要监控的容器。支持使用 `*` 通配符的逗号分隔模式匹配。

示例

```bash
# 通过精确名称排除特定容器
EXCLUDE_CONTAINERS="test-web,test-api"

# 排除所有以 "test-" 开头的容器
EXCLUDE_CONTAINERS="test-*"

# 排除所有以 "-staging" 结尾的容器
EXCLUDE_CONTAINERS="*-staging"

# 排除中间包含特定模式的容器
EXCLUDE_CONTAINERS="*-temp-*"

# 多个模式（排除测试容器和预发布容器）
EXCLUDE_CONTAINERS="test-*,*-staging,dev-*"
```

## 已弃用

这些变量已被弃用，但为了向后兼容性仍会保留。

| 名称   | 默认值 | 描述                  |
| ------ | ------ | --------------------- |
| `PORT` | 45876  | 已重命名为 `LISTEN`。 |

## 设置环境变量

### Docker

对于 Docker Compose，请在 `docker-compose.yml` 中使用 `environment` 或 `env_file` 属性（[说明](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)）。

对于 `docker run`，请使用 `-e`、`--env` 或 `--env-file` 标志（[说明](https://docs.docker.com/reference/cli/docker/container/run/#env)）。

### Windows

通过运行以下命令在 NSSM 中编辑服务。在 GUI 中向右滚动以查找环境变量。

```powershell
nssm edit beszel-agent
```

您也可以直接从命令行更改选项：

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:"
```

完成后重启服务: `nssm restart beszel-agent`

### Homebrew

环境变量可以在 `~/.config/beszel/beszel-agent.env` 中更改。

编辑后重启服务: `brew services restart beszel-agent`

### Systemd

服务配置文件通常位于 `/etc/systemd/system/beszel-agent.service`。在 `[Service]` 部分中直接编辑环境变量，使用 `Environment="KEY=VALUE"`，或使用 `EnvironmentFile=PATH` 定义的环境文件。

或者，您可以使用 `systemctl edit beszel` 或 `systemctl edit beszel-agent` 创建一个覆盖文件来修改配置（[说明](https://docs.fedoraproject.org/en-US/quick-docs/systemd-understanding-and-administering/#_modifying_existing_systemd_services)）。

您还可以使用 `KEY_FILE` 和 `TOKEN_FILE` 从受保护的文件中加载机密（参见 [issue #1627](https://github.com/henrygd/beszel/issues/1627)）。

编辑服务后，重新加载配置并重启：

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # 对于 hub 使用 beszel
```

### 二进制直接执行

将环境变量作为命令行参数包含。例如：`MEM_CALC=htop ./beszel-agent`。
