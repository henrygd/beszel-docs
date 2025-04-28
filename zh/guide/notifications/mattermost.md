# Mattermost

## URL 格式

<span class="bk">mattermost://[__`username`__@]**`mattermost-host`**/**`token`**[/**`channel`**][?icon=__`smiley`__&disabletls=__`yes`__]</span>

## URL 字段

- **UserName** - 覆盖 webhook 用户<br>
  默认值：空<br>
  URL 部分: <code>mattermost://<strong>username</strong>@host:port/token/channel</code>

- **Host** - Mattermost 服务器主机（必需）<br>
  URL 部分: <code>mattermost://username@<strong>host</strong>:port/token/channel</code>

- **Token** - Webhook 令牌（必需）<br>
  URL 部分: <code>mattermost://username@host:port/<strong>token</strong>/channel</code>

- **Channel** - 覆盖 webhook 频道<br>
  默认值：空<br>
  URL 部分: <code>mattermost://username@host:port/token/<strong>channel</strong></code>

## 查询/参数属性

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **DisableTLS**<br>
  默认值：❌ `No`

- **Icon** - 使用表情符号或 URL 作为图标（基于是否存在 http(s)\:// 前缀）<br>
  默认值：空<br>
  别名：`icon_emoji`, `icon_url`

## 在 MatterMost 中创建 Webhook

1. 通过点击菜单中的 _Integrations_（集成）打开集成页面

<a href="/image/mattermost/1.png" target="_blank">
   <img src="/image/mattermost/1.png" alt="截图 1：打开集成页面" />
</a>

2. 点击 _Incoming Webhooks_（传入 Webhook）

<a href="/image/mattermost/2.png" target="_blank">
   <img src="/image/mattermost/2.png" alt="截图 2：点击传入 Webhook" />
</a>

3. 点击 _Add Incoming Webhook_（添加传入 Webhook）

<a href="/image/mattermost/3.png" target="_blank">
   <img src="/image/mattermost/3.png" alt="截图 3：点击添加传入 Webhook" />
</a>

4. 填写 webhook 的信息并点击 _Save_（保存）

<a href="/image/mattermost/4.png" target="_blank">
   <img src="/image/mattermost/4.png" alt="截图 4：填写 webhook 的信息并点击保存" />
</a>

5. 如果一切操作正确，MatterMost 将会给你提供新创建的 webhook 的 _URL_

<a href="/image/mattermost/5.png" target="_blank">
   <img src="/image/mattermost/5.png" alt="截图 5：如果一切操作正确，MatterMost 将会给你提供新创建的 webhook 的 URL" />
</a>

6. 格式化服务 URL

<pre class="bk">
https://your-domain.com/hooks/bywsw8zt5jgpte3nm65qjiru6h
                              └────────────────────────┘
                                        token
mattermost://your-domain.com/bywsw8zt5jgpte3nm65qjiru6h
                             └────────────────────────┘
                                       token
</pre>

## 额外的 URL 配置

与 webhook 配置相比，Mattermost 提供了以其他用户身份发布或发布到其他频道的功能。

为此，你可以将 _user_ 和/或 _channel_ 添加到服务 URL。

<pre class="bk">
mattermost://shoutrrrUser@your-domain.com/bywsw8zt5jgpte3nm65qjiru6h/shoutrrrChannel
             └──────────┘                 └────────────────────────┘ └─────────────┘
                 user                               token                channel
</pre>

<!-- ## Passing parameters via code

If you want to, you also have the possibility to pass parameters to the `send` function.
<br/>
The following example contains all parameters that are currently supported.

```go
params := (*types.Params)(
	&map[string]string{
		"username": "overwriteUserName",
		"channel": "overwriteChannel",
        "icon": "overwriteIcon",
	},
)

service.Send("this is a message", params)
```

This will overwrite any options, that you passed via URL. -->
