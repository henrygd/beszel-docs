# Notifications

Notifications in Beszel are defined using [Shoutrrr](https://github.com/containrrr/shoutrrr) URL schemas.

Shoutrrr is a Go library originally developed for use in [Watchtower](https://github.com/containrrr/watchtower). We use a maintained fork, [nicholas-fedor/shoutrrr](https://github.com/nicholas-fedor/shoutrrr). The docs here are adapted from there.

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
| [MQTT](./mqtt.md)              | mqtts://[**`username`**[:**`password`**]@]**`host`**[:**`port`**]/**`topic`**                                                |
| [Ntfy](./ntfy.md)              | ntfy://:**`accesstoken`**@**`host`**/**`topic`**                                                                             |
| [OpsGenie](./opsgenie.md)      | opsgenie://**`host`**/token?responders=**`responder1`**[,**`responder2`**]\_                                                 |
| [Pushbullet](./pushbullet.md)  | pushbullet://**`api-token`**[/**`device`**/#**`channel`**/**`email`**]                                                       |
| [Pushover](./pushover.md)      | pushover://shoutrrr:**`apiToken`**@**`userKey`**/?devices=**`device1`**[,**`device2`**, ...]                                 |
| [Rocketchat](./rocketchat.md)  | rocketchat://[**`username`**@]**`rocketchat-host`**/**`token`**[/**`channel`&#124;`@recipient`**]                            |
| [Signal](./signal.md)          | signal://[**`user`**[:**`password`**]@]**`host`**[:**`port`**]/**`source_phone`**/**`recipient1`**[,**`recipient2`**,...]    |
| [Slack](./slack.md)            | slack://[**`botname`**@]**`token-a`**/**`token-b`**/**`token-c`**                                                            |
| [Teams](./teams.md)            | teams://**`group`**@**`tenant`**/**`altId`**/**`groupOwner`**/**`extraId`**?**`host`**=**`organization`**.webhook.office.com |
| [Telegram](./telegram.md)      | telegram://**`token`**@telegram?chats=**`@channel-1`**[,**`chat-id-1`**,...]                                                 |
| [Twilio](./twilio.md)          | twilio://**`accountSID`**:**`authToken`**@**`fromNumber`**/**`toNumber`**                                                     |
| [WeCom](./wecom.md)            | wecom://**`key`**                                                                                                            |
| [Zulip Chat](./zulip.md)       | zulip://**`bot-mail`**:**`bot-key`**@**`zulip-domain`**/?stream=**`name-or-id`**&topic=**`name`**                            |

</div>

## Custom templates

By default Beszel sends short English messages such as `Connection to web-1 is down 🔴`. You can change the title and body of any notification on the **Settings → Notifications** page, under *Notification templates*: each field shows the text currently in use, edit it and save. **Reset** restores the built-in text.

Templates use simple `{placeholder}` substitution, the same syntax as the PocketBase mail templates in the admin UI. There are no conditionals or format strings: every value is pre-formatted for you. Unknown placeholders are left in the text unchanged so typos are easy to spot.

### How templates are chosen

Each alert kind (Status, System, Container, SMART, Systemd, Storage pools) has its own template. A field you leave unchanged keeps the built-in English text; title and body are handled independently.

When you define a custom body the link to the system is **not** appended automatically any more. Add `{link}` where you want it.

### Placeholders

Available in every template:

| Placeholder | Value |
|---|---|
| `{title}` / `{message}` | The built-in English title and body |
| `{link}` / `{link_text}` | Link to the system page and its label |
| `{state}` | Kind-specific state word, see below |
| `{time}` `{date}` `{clock}` `{time_iso}` | Current time in your configured timezone, or the hub's own time zone (`TZ`) when none is set (`{clock}` follows your 12h/24h setting) |
| `{timezone}` | The timezone name used above |
| `{system.name}` `{system.host}` `{system.port}` `{system.status}` | From the system record |
| `{system.hostname}` `{system.os}` `{system.kernel}` `{system.cpu}` `{system.cores}` `{system.arch}` | From the agent's system details |
| `{system.agent_version}` `{system.uptime}` | From the latest agent report |

Per kind:

| Kind | Placeholders | `{state}` values |
|---|---|---|
| Status | – | `down`, `up` |
| System (metrics) | `{metric}` `{descriptor}` `{value}` `{unit}` `{threshold}` `{minutes}` | `above`, `below` |
| Container health | `{containers}` `{count}` `{logs}` | `unhealthy`, `healthy` |
| Systemd services | `{services}` `{count}` | `failed`, `recovered` |
| SMART | `{device}` `{model}` `{old_state}` `{new_state}` | the new SMART state |
| Storage pools (ZFS, Btrfs) | `{pool}` `{old_health}` `{new_health}` | the new pool health |

### Changing the wording of values

State values are inserted in English. Change them inline by adding a `key=text` map after the placeholder name:

```
[{system.name}] connection {state:down=lost,up=restored}
```

Unmatched values stay as they are. This works for any placeholder, e.g. `{metric:Memory=RAM}`.

### Examples

Add a timestamp to the built-in text (works the same for every kind):

```
{message}

Time: {time} ({timezone})
{link}
```

Turkish status alert (Status template):

```
Title: [{system.name}] bağlantı {state:down=KOPTU,up=geri geldi}
Body:
Cihaz : {system.name} ({system.host})
Durum : {state:down=KOPTU,up=geri geldi}
Zaman : {time}
{link}
```

Metric alert with the numbers:

```
{descriptor} averaged {value}{unit} over {minutes} min (threshold {threshold}{unit}) — {time}
```

Use **Preview** to render a template with sample data (your first system is used for `{system.*}` values, example values fill in what the agent has not reported yet) and **Send test email** to deliver that preview to your account address (admins: to the configured notification addresses).
