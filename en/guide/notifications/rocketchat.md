# Rocket.chat

## URL Format

<span class="bk">rocketchat://[__`username`__@]**`rocketchat-host`**/**`token`**[/__`channel`&#124;`@recipient`__]</span>

## URL Fields

- **UserName** - Override webhook user<br>
  Default: empty<br>
  URL part: <code>rocketchat://<strong>username</strong>@host:port/token/channel</code>

- **Host** - Rocket.chat server host (Required)<br>
  URL part: <code>rocketchat://username@<strong>host</strong>:port/token/channel</code>

- **Port** - Rocket.chat server port (Required)<br>
  URL part: <code>rocketchat://username@host:<strong>port</strong>/token/channel</code>

- **TokenA** - Rocket.chat server token (Required)<br>
  URL part: <code>rocketchat://username@host:port/<strong>tokenA</strong>/tokenB/channel</code>

- **TokenB** - Rocket.chat server token (Required)<br>
  URL part: <code>rocketchat://username@host:port/tokenA/<strong>tokenB</strong>/channel</code>

- **Channel** - Rocket.chat channel (Required)<br>
  URL part: <code>rocketchat://username@host:port/tokenA/tokenB/<strong>channel</strong></code>

## Creating a Webhook in Rocket.chat

1. Open up the chat Administration by clicking on _Administration_ menu

<a href="/image/rocketchat/1.png" target="_blank">
   <img src="/image/rocketchat/1.png" alt="Screenshot 1: Rocket.chat Administration" />
</a>

2. Open _Integrations_ and then click _New_

<a href="/image/rocketchat/2.png" target="_blank">
   <img src="/image/rocketchat/2.png" alt="Screenshot 2: Rocket.chat Integrations" />
</a>

3. Fill in the information for the webhook and click _Save_. Please don't forget to Enable your integration.

<a href="/image/rocketchat/3.png" target="_blank">
   <img src="/image/rocketchat/3.png" alt="Screenshot 3: Rocket.chat Webhook" />
</a>

4. If you did everything correctly, Rocket.chat will give you the _URL_ and _Token_ to your newly created webhook.

<a href="/image/rocketchat/4.png" target="_blank">
   <img src="/image/rocketchat/4.png" alt="Screenshot 4: Rocket.chat Webhook" />
</a>

5. Format the service URL

<pre class="bk">
rocketchat://your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX
                             └────────────────────────────────────────────────────────────────┘
                                                           token
</pre>

## Additional URL configuration

Rocket.chat provides functionality to post as another user or to another channel / user, compared to the webhook configuration.

To do this, you can add a _sender_ and/or _channel_ / _receiver_ to the service URL.

<pre class="bk">
rocketchat://shoutrrrUser@your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX/shoutrrrChannel
             └──────────┘                 └────────────────────────────────────────────────────────────────┘ └─────────────┘
                sender                                                   token                                   channel

rocketchat://shoutrrrUser@your-domain.com/8eGdRzc9r4YYNyvge/2XYQcX9NBwJBKfQnphpebPcnXZcPEi32Nt4NKJfrnbhsbRfX/@shoutrrrReceiver
             └──────────┘                 └────────────────────────────────────────────────────────────────┘ └───────────────┘
                sender                                                   token                                    receiver
</pre>

For more Rocket.chat webhooks options see [official guide](https://docs.rocket.chat/guides/administrator-guides/integrations).
