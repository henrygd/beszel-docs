# IFTTT

## URL 格式

<span class="bk">ifttt://**`webhookid`**/?events=**`event1`**[,__`event2`__,...]&value1=**`value1`**&value2=**`value2`**&value3=**`value3`**</span>

## URL 字段

- **WebHookID** (**必需**)  
  URL 部分: <code class="service-url">ifttt://<strong>webhookid</strong>/</code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Events** (**必需**)

- **UseMessageAsValue** - 将相应的值字段设置为通知消息  
  默认值：`2`

- **UseTitleAsValue** - 将相应的值字段设置为通知标题  
  默认值：`0`

- **Value1**  
  默认值：_空_

- **Value2**  
  默认值：_空_

- **Value3**  
  默认值：_空_
