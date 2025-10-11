# Zulip Chat

## URL 格式

Shoutrrr 服务 URL 应该如下所示：

<span class="bk">zulip://**`botmail`**:**`botkey`**@**`host`**/?stream=**`stream`**&topic=**`topic`**</span>

## URL 字段

- **BotMail** - 机器人电子邮件地址（必填）<br>
  URL 部分: <code>zulip://<strong>botmail</strong>:botkey@host:port/</code>

- **BotKey** - API 密钥（必填）<br>
  URL 部分: <code>zulip://botmail:<strong>botkey</strong>@host:port/</code>

- **Host** - API 服务器主机名（必填）<br>
  URL 部分: <code>zulip://botmail:botkey@<strong>host:port</strong>/</code>

## 查询参数

属性可以通过 URL 使用 `?key=value&key=value` 等方式提供。

- **Stream**<br>
  默认值: empty

## 示例

::: tip 注意
由于 **`botmail`** 是一个邮件地址，您需要将其中的 `@` 进行 URL 转义为 `%40`。
:::

<pre class="bk">zulip://my-bot%40zulipchat.com:correcthorsebatterystable@example.zulipchat.com?stream=foo&topic=bar</pre>
