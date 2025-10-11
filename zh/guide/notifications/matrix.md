# Matrix

## URL 格式

<span class="bk">matrix://**`user`**:**`password`**@**`host`**:**`port`**/[?rooms=**`!roomID1`**[,**`roomAlias2`**]][&disableTLS=yes]</span>

## URL 字段

- `User` - 用户名，使用访问令牌时为空<br>
  默认值：空<br>
  URL 部分：<code>matrix://<strong>user</strong>:password@host/</code>

- `Password` - 密码或访问令牌（必需）<br>
  URL 部分：<code>matrix://user:<strong>password</strong>@host/</code>

- `Host`（必需）<br>
  URL 部分：<code>matrix://user:password@<strong>host</strong>/</code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **DisableTLS**<br>
  默认值：❌ No

- **Rooms** - 房间别名，或以 ! 前缀的房间 ID<br>
  默认值：空<br>
  别名：room

## 身份验证

如果未指定 `user`，则 `password` 将被视为身份验证令牌。这意味着无论您的服务器使用什么登录
流程，只要您能手动获取令牌，Shoutrrr 就可以使用它。

### 密码登录流程

如果提供了 `user` 和 `password`，如果服务器支持，将尝试 `m.login.password` 登录流程。

## 房间

如果未指定 `rooms`，服务将向用户当前加入的所有房间发送消息。

否则，服务将仅向指定的房间发送消息。如果用户尚未加入这些房间中的任何一个，
但已被邀请，它将自动接受该邀请。

**注意**：除非在 `rooms` 中明确指定，否则服务将**不会**加入任何房间。如果您需要用户
加入这些房间，您可以发送一次明确设置了 `rooms` 的通知。

### 房间查找

`rooms` 中指定的房间如果以 `!` 开头，将被视为房间 ID，并直接用于标识房间。如果
它们没有这样的前缀（或使用*正确转义的* `#`），它们将被视为别名，并且将使用目录
查询来解析它们对应的 ID。

**注意**：不要对频道别名使用未转义的 `#`，因为它将被视为 URL 的 `fragment` 部分。
要么省略它们，要么对 URL 进行编码，例如 `rooms=%23alias:server` 或 `rooms=alias:server`

### TLS

如果您的服务器上未启用 TLS，可以通过提供 `disableTLS=yes` 来禁用它。这将实际上
对 API 调用使用 `http` 而不是 `https`。
