# Zulip Chat

## URL Format

The shoutrrr service URL should look like this:

<span class="bk">zulip://**`botmail`**:**`botkey`**@**`host`**/?stream=**`stream`**&topic=**`topic`**</span>

## URL Fields

- **BotMail** - Bot e-mail address (Required)<br>
  URL part: <code>zulip://<strong>botmail</strong>:botkey@host:port/</code>

- **BotKey** - API Key (Required)<br>
  URL part: <code>zulip://botmail:<strong>botkey</strong>@host:port/</code>

- **Host** - API server hostname (Required)<br>
  URL part: <code>zulip://botmail:botkey@<strong>host:port</strong>/</code>

## Query/Param Props

Props can be supplied through the URL using `?key=value&key=value` etc.

- **Stream**<br>
  Default: empty

## Example

::: tip Note
Since **`botmail`** is a mail address you need to URL escape the `@` in it to `%40`.
:::

<pre class="bk">zulip://my-bot%40zulipchat.com:correcthorsebatterystable@example.zulipchat.com?stream=foo&topic=bar</pre>
