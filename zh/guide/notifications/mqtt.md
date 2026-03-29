# MQTT

<https://shoutrrr.nickfedor.com/services/push/mqtt/>

## URL 格式

MQTT 服务支持两种连接安全性的 URL 模式：

- **`mqtt://`**: 标准未加密连接（默认端口 1883）
- **`mqtts://`**: TLS 加密连接（默认端口 8883）

<span class="bk">mqtt://[**`username`**[:**`password`**]@]**`host`**[:**`port`**]/**`topic`**</span>

<span class="bk">mqtts://[**`username`**[:**`password`**]@]**`host`**[:**`port`**]/**`topic`**</span>

## URL 字段

- **Username** - 认证用户名<br>
  默认值：空<br>
  URL 部分: <code>mqtt://<strong>username</strong>:password@host:port/topic</code>

- **Password** - 认证密码<br>
  默认值：空<br>
  URL 部分: <code>mqtt://username:<strong>password</strong>@host:port/topic</code>

- **Host** - MQTT 代理主机名<br>
  默认值：localhost<br>
  URL 部分: <code>mqtt://username:password@<strong>host</strong>:port/topic</code>

- **Port** - MQTT 代理端口<br>
  默认值：1883 (mqtt) 或 8883 (mqtts)<br>
  URL 部分: <code>mqtt://username:password@host:<strong>port</strong>/topic</code>

- **Topic** - 目标主题名称（必填）<br>
  URL 部分: <code>mqtt://username:password@host:port/<strong>topic</strong></code>

## 查询参数

- **CleanSession** - 以清理会话开始<br>
  默认值：✔ yes

- **ClientID** - MQTT 客户端标识符<br>
  默认值：shoutrrr

- **DisableTLS** - 禁用 TLS 加密<br>
  默认值：❌ no

- **DisableTLSVerification** - 禁用 TLS 证书验证（对自签名证书有用）<br>
  默认值：❌ no

- **QoS** - 服务质量等级 (0, 1, 或 2)<br>
  默认值：0<br>
  可能的值：0 (AtMostOnce), 1 (AtLeastOnce), 2 (ExactlyOnce)

::: warning TLS 配置选项

以下选项控制 TLS 行为：

- **`disabletls`**: 当设置为 `yes` 时，即使使用了 `mqtts://` 模式，也会强制使用 **未加密连接**。这会覆盖模式隐式的 TLS 要求。
- **`disabletlsverification`**: 当设置为 `yes` 时，在仍使用加密的同时禁用 TLS 证书验证。这对自签名证书很有用。

:::

::: danger 安全警告：静默 TLS 降级
在 `mqtts://` 中设置 **`disabletls=yes`** 将强制建立未加密连接，尽管使用了安全模式。这**可能是意料之外的行为**，并可能导致静默降级，即您认为流量已加密但实际并未加密。

**建议**：如果您有意使用未加密连接，请使用 `mqtt://`（非 TLS 模式），而不是将 `mqtts://` 与 `disabletls=yes` 结合使用。
:::

::: tip 何时使用 `disabletls=yes`

此选项适用于特定的边缘情况，例如：

- **TLS 终止代理**：通过处理 TLS 终止的代理连接时，客户端到代理的连接使用 TLS，但代理到代理程序的连接是普通 MQTT。例如，像 Traefik 或 nginx 这样终止 TLS 并转发到内部 MQTT 代理的反向代理。
- **测试环境**：不需要加密的本地开发环境。

:::

## 示例

### 基本通知

<span class="bk">mqtt://broker.example.com/notifications</span>

### 带身份验证

<span class="bk">mqtt://user:pass@broker.example.com:1883/home/alerts</span>

### 安全连接

<span class="bk">mqtts://user:pass@broker.example.com:8883/home/alerts</span>

### Home Assistant

<span class="bk">mqtt://homeassistant.local:1883/homeassistant/notification</span>

### 使用自定义客户端 ID 的 Mosquitto 代理

<span class="bk">mqtt://mosquitto.example.com:1883/sensors/alerts?clientid=shoutrrr-alerts&qos=2</span>

### 自签名证书

<span class="bk">mqtts://broker.local:8883/secure/alerts?disabletlsverification=yes</span>

### 完整配置

<span class="bk">mqtts://admin:secret@mqtt.example.com:8883/production/alerts?clientid=prod-shoutrrr&qos=1&retained=yes&cleansession=no</span>
