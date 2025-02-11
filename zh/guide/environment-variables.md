# 环境变量

## 中心 (Hub)

环境变量可以选择性地以 `BESZEL_HUB_` 作为前缀。

| 名称                    | 默认值 | 描述                                                                                                                             |
| ----------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `CSP`                   | 未设置 | 添加具有此值的 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 头。 |
| `DISABLE_PASSWORD_AUTH` | false  | 禁用密码认证。                                                                                                                   |
| `USER_CREATION`         | false  | 启用 OAuth2 / OIDC 的自动用户创建。                                                                                              |

## 代理 (Agent)

环境变量可以选择性地以 `BESZEL_AGENT_` 作为前缀。

| 名称                | 默认值 | 描述                                                                                         |
| ------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `DOCKER_HOST`       | 未设置 | 如果使用代理，则覆盖 Docker 主机 (docker.sock)。                                             |
| `EXTRA_FILESYSTEMS` | 未设置 | 如果使用二进制文件，则监控额外的磁盘。请参阅 [其他磁盘](./additional-disks.md)。             |
| `FILESYSTEM`        | 未设置 | 用于根磁盘统计的设备、分区或挂载点。                                                         |
| `KEY`               | 未设置 | 用于身份验证的公共 SSH 密钥。在中心提供。                                                    |
| `KEY_FILE`          | 未设置 | 从文件中读取公钥，而不是从环境变量中读取。                                                   |
| `LOG_LEVEL`         | info   | 日志级别。有效值: "debug", "info", "warn", "error"。                                         |
| `MEM_CALC`          | 未设置 | 覆盖默认内存计算。                                                                           |
| `NICS`              | 未设置 | 用于监控带宽的网络接口白名单。                                                               |
| `PORT`              | 45876  | 要监听的端口或地址:端口。                                                                    |
| `PRIMARY_SENSOR`    | 未设置 | 用于仪表板温度显示的温度传感器。                                                             |
| `SENSORS`           | 未设置 | 用于监控的温度传感器白名单。                                                                 |
| `SYS_SENSORS`       | 未设置 | 覆盖用于传感器的系统路径。请参阅 [#160](https://github.com/henrygd/beszel/discussions/160)。 |

### `PRIMARY_SENSOR`

如果未定义特定传感器，则将使用最高温度。

### `DOCKER_HOST`

Beszel 只需要访问读取容器信息权限。对于 [linuxserver/docker-socket-proxy](https://github.com/linuxserver/docker-socket-proxy) 您将设置 `CONTAINERS=1`。

### `MEM_CALC`

已用内存的默认值基于 gopsutil 的 [Used](https://pkg.go.dev/github.com/shirou/gopsutil/v4@v4.24.6/mem#VirtualMemoryStat) 计算，该计算应该与 `free` 非常接近。将 `MEM_CALC` 设置为 `htop` 以使其与 htop 的计算保持一致。
