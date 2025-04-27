# Discord

## URL Format

Your Discord Webhook-URL will look like this:

<span class="bk">https<span>:</span>//discord<span>.com</span>/api/webhooks/**`webhookid`**/**`token`**</span>

The shoutrrr service URL should look like this:

<span class="bk">discord://**`token`**@**`webhookid`**</span>

## URL Fields

- **Token** (**Required**)  
  URL part: <code class="service-url">discord://<strong>token</strong>@webhookid/</code>
- **WebhookID** (**Required**)  
  URL part: <code class="service-url">discord://token@<strong>webhookid</strong>/</code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Avatar** - Override the webhook default avatar with specified URL  
  Default: _empty_  
  Aliases: `avatarurl`

- **Color** - The color of the left border for plain messages  
  Default: `0x50D9ff`

- **ColorDebug** - The color of the left border for debug messages  
  Default: `0x7b00ab`

- **ColorError** - The color of the left border for error messages  
  Default: `0xd60510`

- **ColorInfo** - The color of the left border for info messages  
  Default: `0x2488ff`

- **ColorWarn** - The color of the left border for warning messages  
  Default: `0xffc441`

- **JSON** - Whether to send the whole message as the JSON payload instead of using it as the 'content' field  
  Default: ❌ `No`

- **SplitLines** - Whether to send each line as a separate embedded item  
  Default: ✔ `Yes`

- **Username** - Override the webhook default username  
  Default: _empty_

## Creating a webhook in Discord

1. Open your channel settings by first clicking on the gear icon next to the name of the channel.

<a href="/image/discord/sc-1.png" target="_blank">
   <img src="/image/discord/sc-1.png" alt="Screenshot 1: Open channel settings" />
</a>

2. In the menu on the left, click on _Integrations_.

<a href="/image/discord/sc-2.png" target="_blank">
   <img src="/image/discord/sc-2.png" alt="Screenshot 2: Click on Integrations" />
</a>

3. In the menu on the right, click on _Create Webhook_.

<a href="/image/discord/sc-3.png" target="_blank">
   <img src="/image/discord/sc-3.png" alt="Screenshot 3: Click on Create Webhook" />
</a>

4. Set the name, channel and icon to your liking and click the _Copy Webhook URL_ button.

<a href="/image/discord/sc-4.png" target="_blank">
   <img src="/image/discord/sc-4.png" alt="Screenshot 4: Copy Webhook URL" />
</a>

5. Press the _Save Changes_ button.

<a href="/image/discord/sc-5.png" target="_blank">
   <img src="/image/discord/sc-5.png" alt="Screenshot 5: Save Changes" />
</a>

6. Format the service URL:

<pre class="bk">
https://discord.com/api/webhooks/693853386302554172/W3dE2OZz4C13_4z_uHfDOoC7BqTW288s-z1ykqI0iJnY_HjRqMGO8Sc7YDqvf_KVKjhJ
                                 └────────────────┘ └──────────────────────────────────────────────────────────────────┘
                                     webhook id                                    token

discord://W3dE2OZz4C13_4z_uHfDOoC7BqTW288s-z1ykqI0iJnY_HjRqMGO8Sc7YDqvf_KVKjhJ@693853386302554172
          └──────────────────────────────────────────────────────────────────┘ └────────────────┘
                                          token                                    webhook id
</pre>
