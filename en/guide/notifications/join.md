# Join

## URL Format

<span class="bk">join://shoutrrr:**`api-key`**@join/?devices=**`device1`**[,**`device2`**, ...][&icon=__`icon`__][&title=__`title`__]</span>

## URL Fields

- **APIKey** (**Required**)  
  URL part: <code class="service-url">join://:<strong>apikey</strong>/</code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Devices** - Comma separated list of device IDs (**Required**)

- **Icon** - Icon URL  
  Default: _empty_

## Guide

1.  Go to the [Join Webapp](https://joinjoaomgcd.appspot.com/)
2.  Select your device
3.  Click **Join API**
4.  Your `deviceId` is shown in the top
5.  Click **Show** next to `API Key` to see your key
6.  Your Shoutrrr URL will then be:
    `join://shoutrrr:`**`api-key`**`@join/?devices=`**`deviceId`**

Multiple `deviceId`s can be combined with a `,` (repeat steps 2-4).
