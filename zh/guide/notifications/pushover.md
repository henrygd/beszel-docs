# Pushover

## URL 格式

<span class="bk">pushover://shoutrrr:**`apiToken`**@**`userKey`**/?devices=**`device1`**[,__`device2`__, ...]</span>

## URL 字段

- **Token** - API Token/Key（必需）<br>
  URL 部分: <code>pushover://:<strong>token</strong>@user/</code>

- **User** - 用户 Key（必需）<br>
  URL 部分: <code>pushover://:token@<strong>user</strong>/</code>

## 查询/参数属性

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Devices**<br>
  默认值：空

- **Priority**<br>
  默认值：0

- **Title**<br>
  默认值：空

## 从 Pushover 获取密钥

在你的 [Pushover 控制面板](https://pushover.net/) 中，你可以在右上角查看你的 **`userKey`**。

<a href="/image/pushover/po-1.png" target="_blank">
   <img src="/image/pushover/po-1.png" alt="截图 1：Pushover 控制面板" />
</a>

设备列表中的 `Name` 列是用来引用你的设备的（**`device1`** 等）。

<a href="/image/pushover/po-4.png" target="_blank">
   <img src="/image/pushover/po-4.png" alt="截图 4：Pushover 控制面板" />
</a>

在同一页面底部有指向你的*应用程序*的链接，你可以在那里找到你的 **`apiToken`**。

<a href="/image/pushover/po-2.png" target="_blank">
   <img src="/image/pushover/po-2.png" alt="截图 2：Pushover 控制面板" />
</a>

**`apiToken`** 显示在应用程序页面的顶部。

<a href="/image/pushover/po-3.png" target="_blank">
   <img src="/image/pushover/po-3.png" alt="截图 3：Pushover 控制面板" />
</a>

## 可选参数

你可以在 URL 中指定 **`priority`** 参数：

<span class="bk">pushover://shoutrrr:**`token`**@**`userKey`**/?devices=**`device`**&**`priority`**=1</span>

::: tip 重要
只提供 -1 到 1 之间的优先级值，因为 2 需要额外的参数，这些参数目前尚不支持。
:::

请参阅 [Pushover API 文档](https://pushover.net/api#messages) 获取更多信息。
