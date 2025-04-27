# Gotify

## URL 格式

<span class="bk">gotify://<strong>`host`</strong>:<strong>`port`</strong>/path/<strong>`token`</strong></span>

## URL 字段

- **Host** - 服务器主机名（和可选的端口）（**必需**）  
  URL 部分: <code class="service-url">gotify://<strong>host</strong>:<strong>port</strong>/path/token</code>
- **Path** - 服务器子路径  
  默认值: _空_  
  URL 部分: <code class="service-url">gotify://host:port/<strong>path</strong>/token</code>
- **Token** - 应用程序令牌（**必需**）  
  URL 部分: <code class="service-url">gotify://host:port/path/<strong>token</strong></code>

## 查询/参数属性

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **DisableTLS**  
  默认值：❌ `No`

- **Priority**  
  默认值：`0`

## 示例

::: tip 常见用法
<span class="bk">gotify://gotify.example.com:443/AzyoeNS.D4iJLVa/?priority=1</span>
:::

::: tip 带子路径
<span class="bk">gotify://example.com:443/path/to/gotify/AzyoeNS.D4iJLVa/?priority=0</span>
:::
