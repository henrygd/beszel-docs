# 环境变量

列表值应以逗号分隔且不带空格。例如：`SENSORS=sensor_1,sensor_2`。

## 中心 (Hub)

环境变量可以选择性地以 `BESZEL_HUB_` 作为前缀。

| 名称                    | 默认值 | 描述                                                                                                                             |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | 未设置 | Web 界面的 URL。如果 [从子路径提供服务](./serve-on-subpath)，则必须设置。                                                        |
| `CSP`                   | 未设置 | 添加具有此值的 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 头。 |
| `DISABLE_PASSWORD_AUTH` | false  | 禁用密码认证。                                                                                                                   |
| `SHARE_ALL_SYSTEMS`     | false  | 允许所有用户访问所有系统。                                                                                                       |
| `USER_CREATION`         | false  | 启用 OAuth2 / OIDC 的自动用户创建。                                                                                              |

### `DISABLE_PASSWORD_AUTH`

这不会完全禁用身份验证。如果您想使用 OAuth 代替密码登录，它会禁用密码登录。

### `SHARE_ALL_SYSTEMS`

如果为 true，所有用户都可以看到系统。除非用户被分配了 `readonly` 角色，否则他们还可以编辑或删除任何系统。

## 代理 (Agent)

环境变量可以选择性地以 `BESZEL_AGENT_` 作为前缀。

| 名称                | 默认值 | 描述                                                                                         |
| ------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `DOCKER_HOST`       | 未设置 | 覆盖 Docker 主机 (docker.sock)。                                                             |
| `EXTRA_FILESYSTEMS` | 未设置 | 如果使用二进制文件，则监控额外的磁盘。请参阅 [其他磁盘](./additional-disks.md)。             |
| `FILESYSTEM`        | 未设置 | 用于根磁盘统计的设备、分区或挂载点。                                                         |
| `KEY`               | 未设置 | 用于身份验证的公共 SSH 密钥（可多个）。在中心提供。                                          |
| `KEY_FILE`          | 未设置 | 从文件中读取公钥（可多个），而不是从环境变量中读取。                                         |
| `LISTEN`            | 45876  | 监听的端口或主机:端口。                                                                      |
| `LOG_LEVEL`         | info   | 日志级别。有效值: "debug", "info", "warn", "error"。                                         |
| `MEM_CALC`          | 未设置 | 覆盖默认内存计算。                                                                           |
| `NETWORK`           | 未设置 | 监听器的网络类型。"tcp"、"tcp4"、"tcp6" 或 "unix"。                                          |
| `NICS`              | 未设置 | 用于监控带宽的网络接口白名单。                                                               |
| `PRIMARY_SENSOR`    | 未设置 | 在"所有系统"表格中显示的特定温度传感器。                                                     |
| `SENSORS`           | 未设置 | 温度传感器的白名单或黑名单。                                                                 |
| `SYS_SENSORS`       | 未设置 | 覆盖用于传感器的系统路径。请参阅 [#160](https://github.com/henrygd/beszel/discussions/160)。 |

### `DOCKER_HOST`

如果使用代理，Beszel 只需要访问读取容器信息权限。对于 [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) 您将设置 `CONTAINERS=1`。

您也可以将其设置为空字符串（`DOCKER_HOST=""`）以完全禁用 Docker 监控。

### `KEY` / `KEY_FILE`

可以提供多个密钥，只需用换行符分隔。您也可以通过以 `#` 开头的行添加注释。

### `LISTEN`

主机必须是一个字面量 IP 地址或 Unix 套接字的完整路径。如果是 IPv6 地址，则必须用方括号括起来，例如 `[2001:db8::1]:45876`。

### `MEM_CALC`

已用内存的默认值基于 gopsutil 的 [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) 计算，该计算应该与 `free` 非常接近。将 `MEM_CALC` 设置为 `htop` 以使其与 htop 的计算保持一致。

### `NETWORK`

默认值取决于地址值。如果地址以 `/` 开头，则视为 Unix 套接字。否则，使用 `tcp`。

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
