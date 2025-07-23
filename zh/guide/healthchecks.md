# 健康检查

Hub 和 Agent 都有可用于 Docker 健康检查的 `health` 命令。

这些命令会增加一些 CPU 开销，因此我们建议使用 `60s` 或更长的检查间隔。

## Agent 示例

Agent 健康检查验证代理是否正常运行，而不一定是它是否已连接到中心。

```yaml
services:
  beszel-agent:
    healthcheck:
      test: ['CMD', '/agent', 'health']
      interval: 120s
```

## Hub 示例

Hub 健康检查会测试 `/api/health` 端点是否返回 200 状态码。

```yaml
services:
  beszel-hub:
    healthcheck:
      # URL 是相对于容器的，而不是主机
      test: ['CMD', '/beszel', 'health', '--url', 'http://localhost:8090']
      start_period: 5s # 容器启动后 5 秒进行检查
      interval: 120s # 之后每 120 秒检查一次
```
