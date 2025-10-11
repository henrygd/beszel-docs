# Slack

Slack 通知服务使用 [Slack Webhooks](https://api.slack.com/messaging/webhooks) 或 [Bot API](https://api.slack.com/methods/chat.postMessage) 发送消息。

参阅[指南](https://containrrr.dev/shoutrrr/v0.8/guides/slack/)了解如何获取你的 _token_ 和 _channel_。

## URL 格式

请注意，token 使用前缀来确定类型，通常是 `hook`（用于 webhooks）或 `xoxb`（用于 bot API）。

## URL 字段

- **Token** - API Bot token（必需）<br>
  URL 部分: <code>slack://<strong>token:token</strong>@channel/</code>

- **Channel** - 发送消息的频道，格式为 Cxxxxxxxxxx（必需）<br>
  URL 部分: <code>slack://token:token@<strong>channel</strong>/</code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **BotName** - 机器人名称<br>
  默认值：空
  别名：username

- **Color** - 消息左侧边框颜色<br>
  默认值：空

- **Icon** - 使用表情符号或 URL 作为图标（基于是否存在 http(s):// 前缀）<br>
  默认值：空<br>
  别名：icon_emoji, icon_url

- **ThreadTS** - 父消息的 ts 值（在线程中发送回复消息）<br>
  默认值：空

### 颜色格式

`color` 属性的格式遵循 [slack 文档](https://api.slack.com/reference/messaging/attachments#fields)，
但在 URL 中传递时，`#` 需要转义为 `%23`。

因此 <span style="background:#BADA55;width:.9em;height:.9em;display:inline-block;vertical-align:middle"></span><code>#BADA55</code> 应该写作 `%23BADA55` 等。

## 示例

### Bot API

<span class="bk">slack://xoxb:123456789012-1234567890123-4mt0t4l1YL3g1T5L4cK70k3N@C001CH4NN3L?color=good&title=Great+News&icon=man-scientist&botname=Shoutrrrbot</span>

### Webhook

<span class="bk">slack://hook:WNA3PBYV6-F20DUQND3RQ-Webc4MAvoacrpPakR8phF0zi@webhook?color=good&title=Great+News&icon=man-scientist&botname=Shoutrrrbot</span>
`
