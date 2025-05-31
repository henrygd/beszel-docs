# Notifications

Notifications in Beszel are defined using [Shoutrrr](https://github.com/containrrr/shoutrrr) URL schemas.

Shoutrrr is a Go library originally developed for use in [Watchtower](https://github.com/containrrr/watchtower). We use a pinned version of a maintained fork, [nicholas-fedor/shoutrrr](https://github.com/nicholas-fedor/shoutrrr). The docs here are adapted from there.

The URL for the webhook/push notification host can be set in the settings page.

The alerts can be configured in the systems table.

## Services overview

Click on the service for a more thorough explanation.

<div style="white-space: nowrap;">

| Service                        | URL format                                                                                                                   |
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
