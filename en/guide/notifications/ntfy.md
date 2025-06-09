# Ntfy

Upstream docs: https://docs.ntfy.sh/publish/

## URL Format

<span class="bk">ntfy://[__`username`__:__`password`__&#124;:__`accesstoken`__ @]**`host`**/**`topic`**</span>

## URL Fields

- **Username** - Auth username<br>
  Default: empty<br>
  URL part: <code>ntfy://<strong>username</strong>:password@host/topic</code>

- **Password** - Auth password<br>
  Default: empty<br>
  URL part: <code>ntfy://username:<strong>password</strong>@host/topic</code>

- **Access Token** - Auth accesstoken<br>
  Default: empty<br>
  URL part: <code>ntfy://:<strong>accesstoken</strong>@host/topic</code>

- **Host** - Server hostname and port<br>
  Default: ntfy.sh<br>
  URL part: <code>ntfy://username:password@<strong>host</strong>/topic</code>

- **Topic** - Target topic name (Required)<br>
  URL part: <code>ntfy://username:password@host/<strong>topic</strong></code>

## Query/Param Props

Props can be either supplied using the params argument, or through the URL using `?key=value&key=value` etc.

- **Actions** - Custom user action buttons for notifications, see https://docs.ntfy.sh/publish/#action-buttons<br>
  Default: empty

- **Attach** - URL of an attachment, see attach via URL<br>
  Default: empty

- **Cache** - Cache messages<br>
  Default: ✔ yes

- **Click** - Website opened when notification is clicked<br>
  Default: empty

- **Delay** - Timestamp or duration for delayed delivery, see https://docs.ntfy.sh/publish/#scheduled-delivery<br>
  Default: empty

- **Email** - E-mail address for e-mail notifications<br>
  Default: empty

- **Filename** - File name of the attachment<br>
  Default: empty

- **Firebase** - Send to firebase<br>
  Default: ✔ yes

- **Icon** - URL to use as notification icon<br>
  Default: empty

- **Priority** - Message priority with 1=min, 3=default and 5=max<br>
  Default: default
  Possible values: Min, Low, Default, High, Max

- **Scheme** - Server protocol, http or https<br>
  Default: https

- **Tags** - List of tags that may or not map to emojis<br>
  Default: empty
