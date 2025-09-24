# Signal

## URL 格式

<span class="bk">signal://[**`user`**[:__`password`__]@]**`host`**[:__`port`__]/**`source_phone`**/**`recipient1`**[,__`recipient2`__,...]</span>

## 设置 Signal API 服务器

Signal 通知需要一个 Signal API 服务器，该服务器可以代表注册的 Signal 账户发送消息。这些实现基于 **[signal-cli](https://github.com/AsamK/signal-cli)**，这是 Signal 的非官方命令行界面（3.8k+ stars）。

流行的开源实现包括：

- **[signal-cli-rest-api](https://github.com/bbernhard/signal-cli-rest-api)**: signal-cli 的 Docker 化 REST API 包装器
- **[secured-signal-api](https://github.com/codeshelldev/secured-signal-api)**: signal-cli-rest-api 的安全代理，具有身份验证和访问控制

常见设置包括：

1. **电话号码**: 一个专门注册到 Signal 的电话号码
2. **API 服务器**: 运行具有 REST API 功能的 signal-cli 的服务器
3. **账户链接**: 将服务器作为辅助设备链接到您的 Signal 账户
4. **可选安全层**: 通过代理进行身份验证和端点限制

服务器在初始设置期间必须能够接收 SMS 验证码，并保持与 Signal 服务器的持久连接。

::: tip 设置资源
有关详细设置说明，请参阅 [signal-cli-rest-api 文档](https://github.com/bbernhard/signal-cli-rest-api) 和 [secured-signal-api 文档](https://github.com/codeshelldev/secured-signal-api)。
:::

## URL 参数

### 主机和端口

- `host`: 您的 Signal API 服务器的主机名或 IP 地址（默认：localhost）
- `port`: 端口号（默认：8080）

### 身份验证

Signal 服务支持多种身份验证方法：

- `user`: HTTP 基本身份验证的用户名（可选）
- `password`: HTTP 基本身份验证的密码（可选）
- `token` 或 `apikey`: Bearer 身份验证的 API 令牌（可选）

::: tip 身份验证优先级
如果同时提供了令牌和用户/密码，API 令牌优先并使用 Bearer 身份验证。这对于 [secured-signal-api](https://github.com/codeshelldev/secured-signal-api) 很有用，它更喜欢 Bearer 令牌。
:::

### 源电话号码

`source_phone` 是您的 Signal 电话号码，带有国家代码（例如，+1234567890），该号码已在 API 服务器上注册。

### 收件人

收件人可以是：

- **电话号码**: 带有国家代码（例如，+0987654321）
- **群组 ID**: 格式为 `group.groupId`

### TLS 配置

- 使用 `signal://` 进行 HTTPS（默认，推荐）
- 使用 `signal://...?disabletls=yes` 进行 HTTP（不安全，仅用于本地测试）

## 示例

### 发送到单个电话号码

```
signal://localhost:8080/+1234567890/+0987654321
```

### 发送到多个收件人

```
signal://localhost:8080/+1234567890/+0987654321/+1123456789/group.testgroup
```

### 发送到群组

```
signal://localhost:8080/+1234567890/group.abcdefghijklmnop=
```

### 带身份验证

```
signal://user:password@localhost:8080/+1234567890/+0987654321
```

### 带 API 令牌（Bearer 身份验证）

```
signal://localhost:8080/+1234567890/+0987654321?token=YOUR_API_TOKEN
```

### 使用 HTTP 而不是 HTTPS

```
signal://localhost:8080/+1234567890/+0987654321?disabletls=yes
```

<!-- ## 附件

Signal 服务支持发送 base64 编码的附件。使用 `attachments` 参数和逗号分隔的 base64 数据：

```bash
# 通过 CLI 发送带附件的消息
shoutrrr send "signal://localhost:8080/+1234567890/+0987654321" \
  "带附件的消息" \
  --attachments "base64data1,base64data2"
```

!!! note "附件格式"
附件必须作为 base64 编码的数据提供。API 服务器处理 MIME 类型检测和文件处理。 -->

## 可选参数

您可以在 URL 查询字符串中指定其他参数：

- `disabletls=yes`: 强制使用 HTTP 而不是 HTTPS（与使用 `signals://` 相同）

## 实现说明

Signal 服务使用 HTTP POST 请求向 API 服务器的发送端点发送消息，其中包含消息、源号码和收件人列表的 JSON 有效负载。服务器处理实际的 Signal 协议通信。
