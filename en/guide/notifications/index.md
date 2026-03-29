# Notifications

Notifications in Beszel are defined using [Shoutrrr](https://github.com/containrrr/shoutrrr) URL schemas.

Shoutrrr is a Go library originally developed for use in [Watchtower](https://github.com/containrrr/watchtower). We use a pinned version of a maintained fork, [nicholas-fedor/shoutrrr](https://github.com/nicholas-fedor/shoutrrr). The docs here are adapted from there.

URLs are configured in settings (**Settings** > **Notifications**). Alerts are enabled in the systems table.

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
| [IFTTT](./ifttt.md)            | ifttt://**`key`**/?events=**`event1`**[,**`event2`**,...]&value1=**`value1`**&value2=**`value2`**&value3=**`value3`**        |
| [Join](./join.md)              | join://shoutrrr:**`api-key`**@join/?devices=**`device1`**[,**`device2`**, ...][&icon=**`icon`**]                             |
| [Lark](./lark.md)              | lark://**`host`**/**`token`**?secret=**`secret`**                                                                            |
| [Mattermost](./mattermost.md)  | mattermost://[**`username`**@]**`mattermost-host`**/**`token`**[/**`channel`**]                                              |
| [Matrix](./matrix.md)          | matrix://**`username`**:**`password`**@**`host`**:**`port`**/[?rooms=**`!roomID1`**[,**`roomAlias2`**]]                      |
| [Ntfy](./ntfy.md)              | ntfy://:**`accesstoken`**@**`host`**/**`topic`**                                                                             |
| [OpsGenie](./opsgenie.md)      | opsgenie://**`host`**/token?responders=**`responder1`**[,**`responder2`**]\_                                                 |
| [Pushbullet](./pushbullet.md)  | pushbullet://**`api-token`**[/**`device`**/#**`channel`**/**`email`**]                                                       |
| [Pushover](./pushover.md)      | pushover://shoutrrr:**`apiToken`**@**`userKey`**/?devices=**`device1`**[,**`device2`**, ...]                                 |
| [Rocketchat](./rocketchat.md)  | rocketchat://[**`username`**@]**`rocketchat-host`**/**`token`**[/**`channel`&#124;`@recipient`**]                            |
| [Signal](./signal.md)          | signal://[**`user`**[:**`password`**]@]**`host`**[:**`port`**]/**`source_phone`**/**`recipient1`**[,**`recipient2`**,...]    |
| [Slack](./slack.md)            | slack://[**`botname`**@]**`token-a`**/**`token-b`**/**`token-c`**                                                            |
| [Teams](./teams.md)            | teams://**`group`**@**`tenant`**/**`altId`**/**`groupOwner`**/**`extraId`**?**`host`**=**`organization`**.webhook.office.com |
| [Telegram](./telegram.md)      | telegram://**`token`**@telegram?chats=**`@channel-1`**[,**`chat-id-1`**,...]                                                 |
| [WeCom](./wecom.md)            | wecom://**`key`**                                                                                                            |
| [Zulip Chat](./zulip.md)       | zulip://**`bot-mail`**:**`bot-key`**@**`zulip-domain`**/?stream=**`name-or-id`**&topic=**`name`**                            |

</div>
