# Mattermost

## URL Format

<span class="bk">mattermost://[__`username`__@]**`mattermost-host`**/**`token`**[/**`channel`**][?icon=__`smiley`__&disabletls=__`yes`__]</span>

## URL Fields

- **UserName** - Override webhook user<br>
  Default: empty<br>
  URL part: <code>mattermost://<strong>username</strong>@host:port/token/channel</code>

- **Host** - Mattermost server host (Required)<br>
  URL part: <code>mattermost://username@<strong>host</strong>:port/token/channel</code>

- **Token** - Webhook token (Required)<br>
  URL part: <code>mattermost://username@host:port/<strong>token</strong>/channel</code>

- **Channel** - Override webhook channel<br>
  Default: empty<br>
  URL part: <code>mattermost://username@host:port/token/<strong>channel</strong></code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **DisableTLS**<br>
  Default: ❌ `No`

- **Icon** - Use emoji or URL as icon (based on presence of http(s):// prefix)<br>
  Default: empty<br>
  Aliases: `icon_emoji`, `icon_url`

## Creating a Webhook in MatterMost

1. Open up the Integrations page by clicking on _Integrations_ within the menu

<a href="/image/mattermost/1.png" target="_blank">
   <img src="/image/mattermost/1.png" alt="Screenshot 1: Open up the Integrations page" />
</a>

2. Click _Incoming Webhooks_

<a href="/image/mattermost/2.png" target="_blank">
   <img src="/image/mattermost/2.png" alt="Screenshot 2: Click on Incoming Webhooks" />
</a>

3. Click _Add Incoming Webhook_

<a href="/image/mattermost/3.png" target="_blank">
   <img src="/image/mattermost/3.png" alt="Screenshot 3: Click on Add Incoming Webhook" />
</a>

4. Fill in the information for the webhook and click _Save_

<a href="/image/mattermost/4.png" target="_blank">
   <img src="/image/mattermost/4.png" alt="Screenshot 4: Fill in the information for the webhook and click _Save_" />
</a>

5. If you did everything correctly, MatterMost will give you the _URL_ to your newly created webhook

<a href="/image/mattermost/5.png" target="_blank">
   <img src="/image/mattermost/5.png" alt="Screenshot 5: If you did everything correctly, MatterMost will give you the _URL_ to your newly created webhook" />
</a>

6. Format the service URL

<pre class="bk">
https://your-domain.com/hooks/bywsw8zt5jgpte3nm65qjiru6h
                              └────────────────────────┘
                                        token
mattermost://your-domain.com/bywsw8zt5jgpte3nm65qjiru6h
                             └────────────────────────┘
                                       token
</pre>

## Additional URL configuration

Mattermost provides functionality to post as another user or to another channel, compared to the webhook configuration.

To do this, you can add a _user_ and/or _channel_ to the service URL.

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
