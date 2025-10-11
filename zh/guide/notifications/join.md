# Join

## URL 格式

<span class="bk">join://shoutrrr:**`api-key`**@join/?devices=**`device1`**[,**`device2`**, ...][&icon=__`icon`__][&title=__`title`__]</span>

## URL 字段

- **APIKey** (**必需**)  
  URL 部分: <code class="service-url">join://:<strong>apikey</strong>/</code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Devices** - 设备 ID 的逗号分隔列表 (**必需**)

- **Icon** - 图标 URL  
  默认值：_空_

## 指南

1.  访问 [Join 网页应用](https://joinjoaomgcd.appspot.com/)
2.  选择你的设备
3.  点击 **Join API**
4.  你的 `deviceId` 显示在顶部
5.  点击 `API Key` 旁边的 **Show** 查看你的密钥
6.  你的 Shoutrrr URL 将是：
    `join://shoutrrr:`**`api-key`**`@join/?devices=`**`deviceId`**

多个 `deviceId` 可以用 `,` 组合（重复步骤 2-4）。
