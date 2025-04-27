# Bark

Upstream docs: https://github.com/Finb/Bark

## URL Format

<span class="bk">bark://[__`devicekey`__@]**`host`**[/path/]</span>

## URL Fields

- **DeviceKey** - The key for each device (**Required**)  
  URL part: <code class="service-url">bark://:<strong>devicekey</strong>@host/path/</code>
- **Host** - Server hostname and port (**Required**)  
  URL part: <code class="service-url">bark://:devicekey@<strong>host</strong>/path/</code>
- **Path** - Server path  
  Default: `/`  
  URL part: <code class="service-url">bark://:devicekey@host/<strong>path</strong>/</code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Badge** - The number displayed next to App icon  
  Default: `0`

- **Category** - Reserved field, no use yet  
  Default: _empty_

- **Copy** - The value to be copied  
  Default: _empty_

- **Group** - The group of the notification  
  Default: _empty_

- **Icon** - An url to the icon, available only on iOS 15 or later  
  Default: _empty_

- **Scheme** - Server protocol, http or https  
  Default: `https`

- **Sound** - Value from https://github.com/Finb/Bark/tree/master/Sounds  
  Default: _empty_

- **URL** - Url that will jump when click notification  
  Default: _empty_
