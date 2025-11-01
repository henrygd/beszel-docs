# 环境变量

列表值应以逗号分隔且不带空格。例如：`SENSORS=sensor_1,sensor_2`。

## 中心 (Hub)

环境变量可以选择性地以 `BESZEL_HUB_` 作为前缀。

| 名称                    | 默认值 | 描述                                                                                                                             |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | 未设置 | Web 界面的 URL。如果 [从子路径提供服务](./reverse-proxy)，则必须设置。                                                           |
| `AUTO_LOGIN`            | 未设置 | 自动认证的用户邮箱。                                                                                                             |
| `CONTAINER_DETAILS`     | true   | 允许在 Web 界面中查看容器详情（inspect, logs）。                                                                                  |
| `CSP`                   | 未设置 | 添加具有此值的 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 头。 |
| `DISABLE_PASSWORD_AUTH` | false  | 禁用密码认证。                                                                                                                   |
| `MFA_OTP`               | false  | 为用户和/或超级用户启用 OTP 认证。                                                                                                |
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

### `TRUSTED_AUTH_HEADER`

除非您正在实现自己的身份验证并希望绕过内置身份验证，否则不要设置此选项。指定的头应包含已认证用户的电子邮件。例如，当使用 Cloudflare Access 时，您可能会设置 `TRUSTED_AUTH_HEADER=Cf-Access-Authenticated-User-Email`，因为 Cloudflare 使用该头来提供用户电子邮件。

## 代理 (Agent)

环境变量可以选择性地以 `BESZEL_AGENT_` 作为前缀。

| 名称                | 默认值 | 描述                                                                                         |
| ------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `DATA_DIR`          | 未设置 | 持久数据目录。                                                                               |
| `DOCKER_HOST`       | 未设置 | 覆盖 Docker 主机 (docker.sock)。                                                             |
| `EXTRA_FILESYSTEMS` | 未设置 | 如果使用二进制文件，则监控额外的磁盘。请参阅 [其他磁盘](./additional-disks.md)。             |
| `FILESYSTEM`        | 未设置 | 用于根磁盘统计的设备、分区或挂载点。                                                         |
| `HUB_URL`           | 未设置 | 中心的 URL。                                                                                 |
| `INTEL_GPU_DEVICE`  | 未设置 | 指定 `intel_gpu_top` 的 `-d` 值。请参阅 [Intel GPU](./gpu.md#intel)。                         |
| `KEY`               | 未设置 | 用于身份验证的公共 SSH 密钥（可多个）。在中心提供。                                          |
| `KEY_FILE`          | 未设置 | 从文件中读取公钥（可多个），而不是从环境变量中读取。                                         |
| `LHM`               | false  | 为 Windows 传感器使用 LibreHardwareMonitor。                                                 |
| `LISTEN`            | 45876  | 监听的端口或主机:端口。                                                                      |
| `LOG_LEVEL`         | info   | 日志级别。有效值: "debug", "info", "warn", "error"。                                         |
| `MEM_CALC`          | 未设置 | 覆盖默认内存计算。                                                                           |
| `NETWORK`           | 未设置 | 监听器的网络类型。"tcp"、"tcp4"、"tcp6" 或 "unix"。                                          |
| `NICS`              | 未设置 | 网络接口的白名单或黑名单。                                                                   |
| `PRIMARY_SENSOR`    | 未设置 | 在"所有系统"表格中显示的特定温度传感器。                                                     |
| `SENSORS`           | 未设置 | 温度传感器的白名单或黑名单。                                                                 |
| `SKIP_GPU`          | false  | 禁用 GPU 监控。                                                                              |
| `SMART_DEVICES`     | 未设置 | 要监控的 S.M.A.R.T. 设备列表。                                                                |
| `SYS_SENSORS`       | 未设置 | 覆盖用于传感器的系统路径。请参阅 [#160](https://github.com/henrygd/beszel/discussions/160)。 |
| `SYSTEM_NAME`       | 未设置 | 在通用令牌注册时覆盖系统名称。未设置时默认为主机名。                                         |
| `TOKEN`             | 未设置 | WebSocket 注册令牌。在中心提供。                                                             |
| `TOKEN_FILE`        | 未设置 | 从文件中读取令牌，而不是从环境变量中读取。                                                   |
| `EXCLUDE_CONTAINERS` | 未设置   | 將容器排除在監控範圍之外 |


### `DATA_DIR`

如果未设置，则尝试查找合适的目录。目前仅用于存储系统指纹，但将来可能用于 SQLite 数据库。指纹是确定性的，因此在大多数情况下，如果找不到目录，可以忽略警告。

### `DOCKER_HOST`

如果使用代理，Beszel 只需要访问读取容器信息权限。对于 [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) 您将设置 `CONTAINERS=1`。

您也可以将其设置为空字符串（`DOCKER_HOST=""`）以完全禁用 Docker 监控。

### `KEY` / `KEY_FILE`

可以提供多个密钥，只需用换行符分隔。您也可以通过以 `#` 开头的行添加注释。

### `LHM`

仅限 Windows。代理程序包含 [LibreHardwareMonitorLib](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) 用于检测温度传感器。要使用，请设置 `LHM=true` 并以管理员身份运行代理程序。

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

### `SMART_DEVICES`

用于覆盖 `smartctl --scan` 检测到的设备。每个设备指定为冒号分隔的对，由设备路径和（可选的）设备类型组成。例如：

```dotenv
SMART_DEVICES=/dev/nvme0:nvme,/dev/sda:sat
```

这不需要是完整列表，将与 `smartctl --scan` 检测到的其他设备合并。

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

编辑服务后，重新加载配置并重启：

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent # 对于 hub 使用 beszel
```

### 二进制直接执行

将环境变量作为命令行参数包含。例如：`MEM_CALC=htop ./beszel-agent`。
