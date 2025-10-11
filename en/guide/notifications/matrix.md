# Matrix

## URL Format

<span class="bk">matrix://**`user`**:**`password`**@**`host`**:**`port`**/[?rooms=**`!roomID1`**[,**`roomAlias2`**]][&disableTLS=yes]</span>

## URL Fields

- `User` - Username or empty when using access token<br>
  Default: empty<br>
  URL part: <code>matrix://<strong>user</strong>:password@host/</code>

- `Password` - Password or access token (Required)<br>
  URL part: <code>matrix://user:<strong>password</strong>@host/</code>

- `Host` (Required)<br>
  URL part: <code>matrix://user:password@<strong>host</strong>/</code>

## Query Parameters

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **DisableTLS**<br>
  Default: ❌ No

- **Rooms** - Room aliases, or with ! prefix, room IDs<br>
  Default: empty<br>
  Aliases: room

## Authentication

If no `user` is specified, the `password` is treated as the authentication token. This means that no matter what login
flow your server uses, if you can manually retrieve a token, then Shoutrrr can use it.

### Password Login Flow

If a `user` and `password` is supplied, the `m.login.password` login flow is attempted if the server supports it.

## Rooms

If `rooms` are _not_ specified, the service will send the message to all the rooms that the user has currently joined.

Otherwise, the service will only send the message to the specified rooms. If the user is _not_ in any of those rooms,
but have been invited to it, it will automatically accept that invite.

**Note**: The service will **not** join any rooms unless they are explicitly specified in `rooms`. If you need the user
to join those rooms, you can send a notification with `rooms` explicitly set once.

### Room Lookup

Rooms specified in `rooms` will be treated as room IDs if the start with a `!` and used directly to identify rooms. If
they have no such prefix (or use a _correctly escaped_ `#`) they will instead be treated as aliases, and a directory
lookup will be used to resolve their corresponding IDs.

**Note**: Don't use unescaped `#` for the channel aliases as that will be treated as the `fragment` part of the URL.
Either omit them or URL encode them, I.E. `rooms=%23alias:server` or `rooms=alias:server`

### TLS

If you do not have TLS enabled on the server you can disable it by providing `disableTLS=yes`. This will effectively
use `http` intead of `https` for the API calls.
