# MCP 服务器

Hub 包含一个可选的 [Model Context Protocol](https://modelcontextprotocol.io)（MCP）服务器，让 Claude Code、Cursor 或 VS Code 等 AI 助手可以读取您的监控数据。您可以提问，例如“哪个容器占用的内存最多？”或“昨晚我的 NAS 上的 CPU 峰值是什么原因造成的？”，助手会在 Beszel 中查找答案。

MCP 服务器需要 Hub 版本 `0.22.0` 或更高版本。它是只读的：助手可以查看数据，但不能更改设置、添加或删除系统，也不能在您的系统上运行命令。

## 启用服务器 {#enable}

服务器默认处于禁用状态。在 Hub 上将 `MCP` 环境变量设置为 `true` 并重启：

::: code-group

```yaml [docker-compose.yml]
services:
  beszel:
    image: henrygd/beszel
    environment:
      - BESZEL_HUB_MCP=true
```

```bash [二进制文件]
BESZEL_HUB_MCP=true ./beszel serve
```

:::

之后即可通过 Hub URL 加上 `/mcp` 访问服务器，例如 `https://beszel.example.com/mcp`。如果您[从子路径提供 Hub 服务](./reverse-proxy)，请包含该子路径：`https://example.com/beszel/mcp`。

## 创建 API 密钥 {#api-key}

助手使用 API 密钥登录。每个用户在 Web UI 的 **设置 > API 密钥** 中创建自己的密钥。

- 密钥拥有与您的账户相同的访问权限，因此助手能看到的系统与您在 Web UI 中看到的相同。
- 可选择 1 天到 1 年的过期时间，或永不过期。建议使用会过期的密钥。
- 密钥只显示一次。请立即将其复制到您的 MCP 客户端中。
- **撤销所有 API 密钥** 会使您创建的所有密钥失效，并使您在其他设备上退出登录。更改密码具有相同的效果。

## 连接客户端 {#connect}

客户端通过 streamable HTTP 传输连接，并在 `Authorization` 标头中以 `Bearer <key>` 的形式发送密钥。请将下面示例中的 URL 和 `YOUR_API_KEY` 替换为您自己的。

::: code-group

```bash [Claude Code]
claude mcp add --transport http beszel https://beszel.example.com/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

```json [Cursor (mcp.json)]
{
  "mcpServers": {
    "beszel": {
      "url": "https://beszel.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

```json [VS Code (.vscode/mcp.json)]
{
  "inputs": [
    {
      "type": "promptString",
      "id": "beszel-api-key",
      "description": "Beszel API key",
      "password": true
    }
  ],
  "servers": {
    "beszel": {
      "type": "http",
      "url": "https://beszel.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:beszel-api-key}"
      }
    }
  }
}
```

:::

其他客户端的工作方式相同，只要它们支持 streamable HTTP 并允许您设置自定义 `Authorization` 标头。无法发送自定义标头的客户端无法连接。

::: tip
大多数客户端会以明文形式将密钥存储在其配置文件中。请使用会过期的密钥，并将该文件排除在版本控制之外。
:::

## 助手可以做什么 {#tools}

服务器提供以下工具。助手会根据您的问题选择调用哪些工具。

| 工具                    | 描述                                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `list_systems`          | 您的所有系统及其状态，以及当前的 CPU、内存、磁盘、带宽、温度、平均负载、电池、Wi-Fi 信号和待处理的软件包更新。             |
| `get_system`            | 单个系统的硬件详情（CPU 型号、核心数、内存、操作系统、内核）和当前传感器读数：所有温度、风扇、GPU、交换空间和额外文件系统。 |
| `get_system_stats`      | 单个系统的历史 CPU、内存、磁盘、网络和磁盘 I/O，包含平均值和峰值。适用于[保留期](#history)内的任意时间范围，包括过去的时间窗口。 |
| `get_container_stats`   | 单个系统上容器的历史 CPU、内存和网络使用情况，包含每个容器的平均值、峰值以及峰值出现的时间。                               |
| `list_containers`       | 当前的 Docker / Podman 容器及其状态、健康状况、镜像、CPU、内存和网络使用情况。                                             |
| `list_services`         | [Systemd 服务](./systemd)及其状态、CPU 和内存使用情况。                                                                    |
| `get_disk_health`       | [S.M.A.R.T. 数据](./smart-data)（状态、温度、通电时间）以及 ZFS / Btrfs [存储池](./storage-pools)的健康状况。              |
| `list_network_monitors` | [网络监控](./network-monitors)及其最新延迟，以及 1 小时内的延迟和丢包率。                                                  |
| `list_alerts`           | 您的告警配置，以及每个告警当前是否已触发。                                                                                 |
| `list_alert_events`     | 您已触发和已解决告警的历史记录，最多可追溯 30 天。                                                                         |

`list_containers`、`list_services`、`get_disk_health` 和 `list_network_monitors` 可以一次搜索您的所有系统，因此像“是否有服务出现故障？”这样的问题无需逐个检查每个系统。

### 示例问题 {#examples}

- 哪些系统已离线？它们最后一次在线是什么时候？
- 在我的所有系统中，哪个容器占用的内存最多？
- 是否有磁盘出现故障或存储池处于降级状态？
- 是否有 systemd 服务处于失败状态？
- 本周触发了哪些告警？它们是否已解决？
- `nas` 的 CPU 在凌晨 3 点左右出现峰值。是哪个容器造成的？
- 过去 7 天里 `web-1` 的内存使用情况有何变化？
- 哪些网络监控的丢包率最高？

### 历史数据 {#history}

历史数据以多种分辨率存储，较旧的数据以较粗的分辨率保留。助手最多可以回溯 30 天，细节程度取决于时间范围的起点有多久远：

| 分辨率  | 保留时间 |
| :------ | :------- |
| 1 分钟  | 1 小时   |
| 10 分钟 | 12 小时  |
| 20 分钟 | 24 小时  |
| 2 小时  | 7 天     |
| 8 小时  | 30 天    |

例如，助手调查 12 小时前的峰值时会得到 20 分钟分辨率的数据，因此非常短暂的峰值可能会被平均掉。

容器历史包括 CPU、内存和网络使用情况。容器状态和健康检查不会被长期存储。

## 访问与隐私 {#access}

- 助手看到的内容与 API 密钥所属用户在 Web UI 中看到的完全一致：与该用户共享的系统，或者在启用 [`SHARE_ALL_SYSTEMS`](./environment-variables#share-all-systems) 时的所有系统。告警和告警历史仅限于该用户自己的告警。
- 具有 `readonly` 角色的用户可以使用 MCP 服务器，因为它不会更改数据。
- 助手读取的数据（例如系统名称、主机名、容器名称和指标）会发送到您的客户端所使用的 AI 模型。在将托管的 AI 服务连接到包含敏感系统的 Hub 之前，请考虑这一点。

## 故障排除 {#troubleshooting}

**404 Not Found**：MCP 服务器未启用。请设置 `BESZEL_HUB_MCP=true` 并重启 Hub。

**401 Unauthorized**：密钥缺失、无效、已过期或已被撤销。请在 **设置 > API 密钥** 中创建新密钥，并检查客户端是否以 `Authorization: Bearer <key>` 的形式发送它。

**反向代理问题**：请确保代理将请求转发到 `/mcp`，包括 `Authorization` 标头。

**405 Method Not Allowed**：对于 `GET` 和 `DELETE` 请求，这是预期行为。服务器只使用 `POST`，因此不会保持会话或打开事件流。不支持需要旧版 SSE 传输的客户端。
