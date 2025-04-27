# Telegram

## URL 格式

<span class="bk">telegram://**`token`**@telegram?chats=**`channel-1`**[,__`chat-id-1`__,...]</span>

## URL 字段

- **Token** - API 机器人令牌（必需）<br>
  URL 部分: <code>telegram://<strong>token</strong>@telegram/</code>

## 查询/参数属性

参数可以通过 params 参数提供，或者通过 URL 使用
?key=value&key=value 等形式提供。

- **Chats** - 聊天 ID 或频道名称（使用 @channel-name）（必需）<br>
  别名: channels

- **Notification** - 如果禁用，消息将静默发送<br>
  默认值: `Yes`

- **ParseMode** - 文本消息应如何解析<br>
  默认值: `None`<br>
  可能的值: `None`, `Markdown`, `HTML`, `MarkdownV2`

- **Preview** - 如果禁用，将不显示 URL 的网页预览<br>
  默认值: `Yes`

## 获取 Telegram 令牌

联系 [the botfather](https://core.telegram.org/bots#6-botfather)。

## 识别目标聊天/频道

`chats` 参数由一个或多个 `Chat ID` 或 `channel name` 组成。

### 公共频道

频道名称可以在 telegram 客户端的 `Channel info` 部分查看公共频道。
将链接中的 `t.me/` 前缀替换为 `@`。

请注意以下几点：

- 频道名称需要添加 `@` 前缀以便识别。

- 如果你的频道只有邀请链接（以 `t.me/+` 开头），你必须使用它的 Chat ID（见下文）

- 可以添加 `message_thread_id` 参数（[参考](https://core.telegram.org/bots/api#sendmessage)），格式为 `$chat_id:$message_thread_id`。关于如何获取 `message_thread_id` 的[更多信息](https://stackoverflow.com/questions/74773675/how-to-get-topic-id-for-telegram-group-chat/75178418#75178418)。

### 聊天

私人频道、群组聊天和私人聊天通过 `Chat ID` 识别。不幸的是，这些 ID 通常在 telegram 客户端中不可见。
获取它们的最简单方法是使用 `shoutrrr generate telegram` 命令，该命令将引导你创建包含目标聊天的 URL。

::: tip
你可以使用 docker 中的 `containrrr/shoutrrr` 镜像运行它，无需下载/安装 `shoutrrr` CLI：
`docker run --rm -it containrrr/shoutrrr generate telegram`
:::

### 询问 @shoutrrrbot

获取 Chat ID 的另一种方法是将目标聊天中的消息转发给 [@shoutrrrbot](https://t.me/shoutrrrbot)。

它将回复原始消息所在聊天的 Chat ID。

请注意，对于群组聊天，这种方法可能无法正常工作，因为这些消息只被视为由用户发布，而不是在特定聊天中发布。
相反，你可以使用第二种方法，即邀请 @shoutrrrbot 加入你的群组聊天并向它发送消息（消息以 @shoutrrrbot 开头）。然后你可以安全地将机器人从群组中移除。

除非机器人的使用量超过 GCP 免费层级，否则它应该会持续在线。它的源代码可在 [github.com/containrrr/shoutrrrbot](https://github.com/containrrr/shoutrrrbot) 获取。

## 可选参数

你可以在 URL 中指定 **`notification`**、**`preview`** 和 **`parsemode`** 参数：

<span class="bk">telegram://token@telegram/?channels=channel&**`notification`**=no&**`preview`**=false&**`parsemode`**=html</span>

详情参见 [Telegram 文档](https://core.telegram.org/bots/api#sendmessage)。

::: tip
`preview` 和 `notification` 与它们的 API 对应项（`disable_web_page_preview` 和 `disable_notification`）相反
:::

### 解析模式和标题

如果指定了解析模式，则需要根据 [格式化选项](https://core.telegram.org/bots/api#formatting-options) 中相应部分转义消息。

当指定了标题时，它将被添加到消息前面，但这仅支持 `HTML` 解析模式。请注意，如果未指定解析模式，消息将被转义并使用 `HTML` 发送。

由于 markdown 模式很难正确转义，建议坚持使用 `HTML` 解析模式。
