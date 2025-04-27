# Bark

上游文档：https://github.com/Finb/Bark

## URL 格式

<span class="bk">bark://[__`devicekey`__@]**`host`**[/path/]</span>

## URL 字段

- **DeviceKey** - 每个设备的密钥（**必需**）  
  URL 部分: <code class="service-url">bark://:<strong>devicekey</strong>@host/path/</code>
- **Host** - 服务器主机名和端口（**必需**）  
  URL 部分: <code class="service-url">bark://:devicekey@<strong>host</strong>/path/</code>
- **Path** - 服务器路径  
  默认值：`/`  
  URL 部分: <code class="service-url">bark://:devicekey@host/<strong>path</strong>/</code>

## 查询/参数属性

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Badge** - 显示在应用图标旁边的数字  
  默认值：`0`

- **Category** - 预留字段，暂无用途  
  默认值：_空_

- **Copy** - 需要复制的值  
  默认值：_空_

- **Group** - 通知的分组  
  默认值：_空_

- **Icon** - 图标的 URL，仅在 iOS 15 或更高版本可用  
  默认值：_空_

- **Scheme** - 服务器协议，http 或 https  
  默认值：`https`

- **Sound** - 来自 https://github.com/Finb/Bark/tree/master/Sounds 的值  
  默认值：_空_
