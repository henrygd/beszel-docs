# 通知

Beszel 中的通知使用 [Shoutrrr](https://github.com/containrrr/shoutrrr) URL 模式定义。

Shoutrrr 是一个最初为 [Watchtower](https://github.com/containrrr/watchtower) 开发的 Go 库。我们使用一个维护的分支 [nicholas-fedor/shoutrrr](https://github.com/nicholas-fedor/shoutrrr) 的固定版本。这里的文档是根据它们改编的。

## 服务概览

点击服务获取更详细的说明。

<div style="white-space: nowrap;">

| 服务                           | URL 格式                                                                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| [Generic](./generic.md)        | generic://example.com?template=json                                                                                          |
| [Bark](./bark.md)              | bark://**`devicekey`**@**`host`**                                                                                            |
| [Discord](./discord.md)        | discord://**`token`**@**`id`**                                                                                               |
| [Gotify](./gotify.md)          | gotify://**`gotify-host`**/**`token`**                                                                                       |
| [Google Chat](./googlechat.md) | googlechat://chat.googleapis.com/v1/spaces/`FOO`/messages?key=`bar`&token=`baz`                                              |
| [IFTTT](./ifttt.md)            | ifttt://**`key`**/?events=**`event1`**[,__`event2`__,...]&value1=**`value1`**&value2=**`value2`**&value3=**`value3`**        |
| [Join](./join.md)              | join://shoutrrr:**`api-key`**@join/?devices=**`device1`**[,**`device2`**, ...][&icon=__`icon`__]                             |
| [Lark](./lark.md)              | lark://**`host`**/**`token`**?secret=**`secret`**                                                                            |
| [Mattermost](./mattermost.md)  | mattermost://[__`username`__@]**`mattermost-host`**/**`token`**[/__`channel`__]                                              |
| [Matrix](./matrix.md)          | matrix://**`username`**:**`password`**@**`host`**:**`port`**/[?rooms=**`!roomID1`**[,__`roomAlias2`__]]                      |
| [Ntfy](./ntfy.md)              | ntfy://**`username`**:**`password`**@ntfy.sh/**`topic`**                                                                     |
| [OpsGenie](./opsgenie.md)      | opsgenie://**`host`**/token?responders=**`responder1`**[,__`responder2`__]\_                                                 |
| [Pushbullet](./pushbullet.md)  | pushbullet://**`api-token`**[/__`device`__/#__`channel`__/__`email`__]                                                       |
| [Pushover](./pushover.md)      | pushover://shoutrrr:**`apiToken`**@**`userKey`**/?devices=**`device1`**[,__`device2`__, ...]                                 |
| [Rocketchat](./rocketchat.md)  | rocketchat://[__`username`__@]**`rocketchat-host`**/**`token`**[/__`channel`&#124;`@recipient`__]                            |
| [Slack](./slack.md)            | slack://[__`botname`__@]**`token-a`**/**`token-b`**/**`token-c`**                                                            |
| [Teams](./teams.md)            | teams://**`group`**@**`tenant`**/**`altId`**/**`groupOwner`**/**`extraId`**?**`host`**=**`organization`**.webhook.office.com |
| [Telegram](./telegram.md)      | telegram://**`token`**@telegram?chats=**`@channel-1`**[,__`chat-id-1`__,...]                                                 |
| [Zulip Chat](./zulip.md)       | zulip://**`bot-mail`**:**`bot-key`**@**`zulip-domain`**/?stream=**`name-or-id`**&topic=**`name`**                            |

</div>
