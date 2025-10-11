# IFTTT

## URL Format

<span class="bk">ifttt://**`webhookid`**/?events=**`event1`**[,__`event2`__,...]&value1=**`value1`**&value2=**`value2`**&value3=**`value3`**</span>

## URL Fields

- **WebHookID** (**Required**)  
  URL part: <code class="service-url">ifttt://<strong>webhookid</strong>/</code>

## Query Parameters

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Events** (**Required**)

- **UseMessageAsValue** - Sets the corresponding value field to the notification message  
  Default: `2`

- **UseTitleAsValue** - Sets the corresponding value field to the notification title  
  Default: `0`

- **Value1**  
  Default: _empty_

- **Value2**  
  Default: _empty_

- **Value3**  
  Default: _empty_
