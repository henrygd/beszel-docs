# Slack

The Slack notification service uses either [Slack Webhooks](https://api.slack.com/messaging/webhooks) or the [Bot API](https://api.slack.com/methods/chat.postMessage) to send messages.

See the [guides](https://containrrr.dev/shoutrrr/v0.8/guides/slack/) for information on how to get your _token_ and _channel_.

## URL Format

Note that the token uses a prefix to determine the type, usually either `hook` (for webhooks) or `xoxb` (for bot API).

## URL Fields

- **Token** - API Bot token (Required)<br>
  URL part: <code>slack://<strong>token:token</strong>@channel/</code>

- **Channel** - Channel to send messages to in Cxxxxxxxxxx format (Required)<br>
  URL part: <code>slack://token:token@<strong>channel</strong>/</code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **BotName** - Bot name<br>
  Default: empty
  Aliases: username

- **Color** - Message left-hand border color<br>
  Default: empty

- **Icon** - Use emoji or URL as icon (based on presence of http(s)\:// prefix)<br>
  Default: empty<br>
  Aliases: icon_emoji, icon_url

- **ThreadTS** - ts value of the parent message (to send message as reply in thread)<br>
  Default: empty

### Color format

The format for the `color` prop follows the [slack docs](https://api.slack.com/reference/messaging/attachments#fields)
but `#` needs to be escaped as `%23` when passed in a URL.

So <span style="background:#BADA55;width:.9em;height:.9em;display:inline-block;vertical-align:middle"></span><code>#BADA55</code> would be `%23BADA55` etc.

## Examples

### Bot API

<span class="bk">slack://xoxb:123456789012-1234567890123-4mt0t4l1YL3g1T5L4cK70k3N@C001CH4NN3L?color=good&title=Great+News&icon=man-scientist&botname=Shoutrrrbot</span>

### Webhook

<span class="bk">slack://hook:WNA3PBYV6-F20DUQND3RQ-Webc4MAvoacrpPakR8phF0zi@webhook?color=good&title=Great+News&icon=man-scientist&botname=Shoutrrrbot</span>
`
