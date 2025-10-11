# Gotify

## URL Format

<span class="bk">gotify://<strong>`host`</strong>:<strong>`port`</strong>/path/<strong>`token`</strong></span>

## URL Fields

- **Host** - Server hostname (and optionally port) (**Required**)  
  URL part: <code class="service-url">gotify://<strong>host</strong>:<strong>port</strong>/path/token</code>
- **Path** - Server subpath  
  Default: _empty_  
  URL part: <code class="service-url">gotify://host:port/<strong>path</strong>/token</code>
- **Token** - Application token (**Required**)  
  URL part: <code class="service-url">gotify://host:port/path/<strong>token</strong></code>

## Query Parameters

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **DisableTLS**  
  Default: ❌ `No`

- **Priority**  
  Default: `0`

## Examples

::: tip Common usage
<span class="bk">gotify://gotify.example.com:443/AzyoeNS.D4iJLVa/?priority=1</span>
:::

::: tip With subpath
<span class="bk">gotify://example.com:443/path/to/gotify/AzyoeNS.D4iJLVa/?priority=0</span>
:::
