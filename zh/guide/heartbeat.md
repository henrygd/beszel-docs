# 心跳监控

Beszel 可以向外部监控端点（例如 BetterStack、Uptime Kuma、Healthchecks.io）发送定期的出站 ping。这允许您在不将 Hub 暴露给互联网的情况下，监控 Beszel 实例及其跟踪的系统的健康状况。

## 配置

心跳功能通过环境变量进行配置：

| 变量 | 描述 | 默认值 |
| :--- | :--- | :--- |
| `HEARTBEAT_URL` | 要 ping 的外部 URL。如果为空，则禁用该功能。 | (空) |
| `HEARTBEAT_INTERVAL` | 两次 ping 之间的秒数。 | `60` |
| `HEARTBEAT_METHOD` | 要使用的 HTTP 方法（`GET`、`POST` 或 `HEAD`）。 | `POST` |

## POST 负载示例

使用 `POST`（默认值）时，Beszel 会发送包含有关您的系统和触发告警的详细状态信息的 JSON 负载。

### 示例负载

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
