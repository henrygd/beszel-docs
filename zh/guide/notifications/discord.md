# Discord

## URL 格式

你的 Discord Webhook-URL 看起来像这样：

<span class="bk">https<span>:</span>//discord<span>.com</span>/api/webhooks/**`webhookid`**/**`token`**</span>

shoutrrr 服务 URL 应该看起来像这样：

<span class="bk">discord://**`token`**@**`webhookid`**</span>

## URL 字段

- **Token** (**必需**)  
  URL 部分: <code class="service-url">discord://<strong>token</strong>@webhookid/</code>
- **WebhookID** (**必需**)  
  URL 部分: <code class="service-url">discord://token@<strong>webhookid</strong>/</code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Avatar** - 用指定的 URL 覆盖 webhook 默认头像  
  默认值：_空_  
  别名：`avatarurl`

- **Color** - 普通消息左边框的颜色  
  默认值：`0x50D9ff`

- **ColorDebug** - 调试消息左边框的颜色  
  默认值：`0x7b00ab`

- **ColorError** - 错误消息左边框的颜色  
  默认值：`0xd60510`

- **ColorInfo** - 信息消息左边框的颜色  
  默认值：`0x2488ff`

- **ColorWarn** - 警告消息左边框的颜色  
  默认值：`0xffc441`

- **JSON** - 是否将整个消息作为 JSON 负载发送，而不是将其用作 'content' 字段  
  默认值：❌ `No`

- **SplitLines** - 是否将每行作为单独的嵌入项发送  
  默认值：✔ `Yes`

- **Username** - 覆盖 webhook 默认用户名  
  默认值：_空_

## 在 Discord 中创建 webhook

1. 通过首先点击频道名称旁边的齿轮图标来打开频道设置。

<a href="/image/discord/sc-1.png" target="_blank">
   <img src="/image/discord/sc-1.png" alt="截图 1：打开频道设置" />
</a>

2. 在左侧菜单中，点击 _Integrations_（集成）。

<a href="/image/discord/sc-2.png" target="_blank">
   <img src="/image/discord/sc-2.png" alt="截图 2：点击集成" />
</a>

3. 在右侧菜单中，点击 _Create Webhook_（创建 Webhook）。

<a href="/image/discord/sc-3.png" target="_blank">
   <img src="/image/discord/sc-3.png" alt="截图 3：点击创建 Webhook" />
</a>

4. 根据你的喜好设置名称、频道和图标，然后点击 _Copy Webhook URL_（复制 Webhook URL）按钮。

<a href="/image/discord/sc-4.png" target="_blank">
   <img src="/image/discord/sc-4.png" alt="截图 4：复制 Webhook URL" />
</a>

5. 按下 _Save Changes_（保存更改）按钮。

<a href="/image/discord/sc-5.png" target="_blank">
   <img src="/image/discord/sc-5.png" alt="截图 5：保存更改" />
</a>

6. 格式化服务 URL：

<pre class="bk">
https://discord.com/api/webhooks/693853386302554172/W3dE2OZz4C13_4z_uHfDOoC7BqTW288s-z1ykqI0iJnY_HjRqMGO8Sc7YDqvf_KVKjhJ
                                 └────────────────┘ └──────────────────────────────────────────────────────────────────┘
                                     webhook id                                    token

discord://W3dE2OZz4C13_4z_uHfDOoC7BqTW288s-z1ykqI0iJnY_HjRqMGO8Sc7YDqvf_KVKjhJ@693853386302554172
          └──────────────────────────────────────────────────────────────────┘ └────────────────┘
                                          token                                    webhook id
</pre>
