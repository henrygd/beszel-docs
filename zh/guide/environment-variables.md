# 环境变量

列表值应以逗号分隔且不带空格。例如：`SENSORS=sensor_1,sensor_2`。

## 中心 (Hub)

环境变量可以选择性地以 `BESZEL_HUB_` 作为前缀。

| 名称                    | 默认值 | 描述                                                                                                                             |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `APP_URL`               | 未设置 | Web 界面的 URL。如果从子路径提供服务，则必须设置。                                                                               |
| `CSP`                   | 未设置 | 添加具有此值的 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 头。 |
| `DISABLE_PASSWORD_AUTH` | false  | 禁用密码认证。                                                                                                                   |
| `USER_CREATION`         | false  | 启用 OAuth2 / OIDC 的自动用户创建。                                                                                              |

## 代理 (Agent)

环境变量可以选择性地以 `BESZEL_AGENT_` 作为前缀。

| 名称                | 默认值 | 描述                                                                                         |
| ------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `ADDR`              | 45876   | 监听的端口或主机:端口。                                                             |
| `DOCKER_HOST`       | 未设置 | 如果使用代理，则覆盖 Docker 主机 (docker.sock)。                                             |
| `EXTRA_FILESYSTEMS` | 未设置 | 如果使用二进制文件，则监控额外的磁盘。请参阅 [其他磁盘](./additional-disks.md)。             |
| `FILESYSTEM`        | 未设置 | 用于根磁盘统计的设备、分区或挂载点。                                                         |
| `KEY`               | 未设置 | 用于身份验证的公共 SSH 密钥。在中心提供。                                                    |
| `KEY_FILE`          | 未设置 | 从文件中读取公钥，而不是从环境变量中读取。                                                   |
| `LOG_LEVEL`         | info   | 日志级别。有效值: "debug", "info", "warn", "error"。                                         |
| `MEM_CALC`          | 未设置 | 覆盖默认内存计算。                                                                           |
| `NETWORK`           | 未设置   | 监听器的网络类型。"tcp"、"tcp4"、"tcp6" 或 "unix"。                                        |
| `NICS`              | 未设置 | 用于监控带宽的网络接口白名单。                                                               |
| `PORT`              | 45876  | 要监听的端口或地址:端口。                                                                    |
| `PRIMARY_SENSOR`    | 未设置 | 用于仪表板温度显示的温度传感器。                                                             |
| `SENSORS`           | 未设置 | 用于监控的温度传感器白名单。                                                                 |
| `SYS_SENSORS`       | 未设置 | 覆盖用于传感器的系统路径。请参阅 [#160](https://github.com/henrygd/beszel/discussions/160)。 |

### `ADDR`

主机必须是一个字面量 IP 地址或 Unix 套接字的完整路径。如果是 IPv6 地址，则必须用方括号括起来，例如 `[2001:db8::1]:45876`。

### `DOCKER_HOST`

Beszel 只需要访问读取容器信息权限。对于 [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) 您将设置 `CONTAINERS=1`。

### `NETWORK`

默认值取决于地址值。如果地址以 `/` 开头，则视为 Unix 套接字。否则，使用 `tcp`。

### `MEM_CALC`

已用内存的默认值基于 gopsutil 的 [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) 计算，该计算应该与 `free` 非常接近。将 `MEM_CALC` 设置为 `htop` 以使其与 htop 的计算保持一致。

### `PRIMARY_SENSOR`

如果未定义特定传感器，则将使用最高温度。

### `SENSORS`

设置为空字符串（`SENSORS=""`）以禁用温度监控。

## 已弃用

这些变量已被弃用，但为了向后兼容性仍会保留。

| 名称   | 默认值 | 描述        |
| ------ | ------- | ------------------ |
| `PORT` | 45876   | 已重命名为 `ADDR`。 |