# Rocket.chat

## URL 格式

<span class="bk">rocketchat://[__`username`__@]**`rocketchat-host`**/**`token`**[/__`channel`&#124;`@recipient`__]</span>

## URL 字段

- **UserName** - 覆盖 webhook 用户<br>
  默认值: empty<br>
  URL 部分: <code>rocketchat://<strong>username</strong>@host:port/token/channel</code>

- **Host** - Rocket.chat 服务器主机（必填）<br>
  URL 部分: <code>rocketchat://username@<strong>host</strong>:port/token/channel</code>

- **Port** - Rocket.chat 服务器端口（必填）<br>
  URL 部分: <code>rocketchat://username@host:<strong>port</strong>/token/channel</code>

- **TokenA** - Rocket.chat 服务器令牌（必填）<br>
  URL 部分: <code>rocketchat://username@host:port/<strong>tokenA</strong>/tokenB/channel</code>

- **TokenB** - Rocket.chat 服务器令牌（必填）<br>
  URL 部分: <code>rocketchat://username@host:port/tokenA/<strong>tokenB</strong>/channel</code>

- **Channel** - Rocket.chat 频道（必填）<br>
  URL 部分: <code>rocketchat://username@host:port/tokenA/tokenB/<strong>channel</strong></code>

## 在 Rocket.chat 中创建 Webhook

1. 通过点击 _Administration_ 菜单打开聊天管理

<a href="/image/rocketchat/1.png" target="_blank">
   <img src="/image/rocketchat/1.png" alt="截图 1: Rocket.chat 管理" />
</a>

2. 打开 _Integrations_ 然后点击 _New_

<a href="/image/rocketchat/2.png" target="_blank">
   <img src="/image/rocketchat/2.png" alt="截图 2: Rocket.chat 集成" />
</a>

3. 填写 webhook 的信息并点击 _Save_。请不要忘记启用您的集成。

<a href="/image/rocketchat/3.png" target="_blank">
   <img src="/image/rocketchat/3.png" alt="截图 3: Rocket.chat Webhook" />
</a>

4. 如果您正确完成了所有操作，Rocket.chat 将给您提供新创建的 webhook 的 _URL_ 和 _Token_。

<a href="/image/rocketchat/4.png" target="_blank">
   <img src="/image/rocketchat/4.png" alt="截图 4: Rocket.chat Webhook" />
</a>

5. 格式化服务 URL

<pre class="bk">
rocketchat://your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX
                             └────────────────────────────────────────────────────────────────┘
                                                           token
</pre>

## 附加 URL 配置

Rocket.chat 提供功能，可以与 webhook 配置相比，以另一个用户身份发布或发布到另一个频道/用户。

为此，您可以向服务 URL 添加 _sender_ 和/或 _channel_ / _receiver_。

<pre class="bk">
rocketchat://shoutrrrUser@your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX/shoutrrrChannel
             └──────────┘                 └────────────────────────────────────────────────────────────────┘ └─────────────┘
                sender                                                   token                                   channel

rocketchat://shoutrrrUser@your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX/@shoutrrrReceiver
             └──────────┘                 └────────────────────────────────────────────────────────────────┘ └───────────────┘
                sender                                                   token                                    receiver
</pre>

有关更多 Rocket.chat webhooks 选项，请参阅[官方指南](https://docs.rocket.chat/guides/administrator-guides/integrations)。
