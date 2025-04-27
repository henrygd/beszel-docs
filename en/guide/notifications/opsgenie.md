# OpsGenie

## URL Format

<span class="bk">opsgenie://[__`host`__:__`port`__/]**`apikey`**</span>

## URL Fields

- **Host** - The OpsGenie API host. Use 'api.eu.opsgenie.com' for EU instances<br>
  Default: `api.opsgenie.com`<br>
  URL part: <code>opsgenie://<strong>host</strong>:port/apikey</code>

- **Port** - The OpsGenie API port.<br>
  Default: `443`<br>
  URL part: <code>opsgenie://host:<strong>port</strong>/apikey</code>

- **APIKey** - The OpsGenie API key (Required)<br>
  URL part: <code>opsgenie://host:port/<strong>apikey</strong></code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Actions** - Custom actions that will be available for the alert<br>
  Default: empty

- **Alias** - Client-defined identifier of the alert<br>
  Default: empty

- **Description** - Description field of the alert<br>
  Default: empty

- **Entity** - Entity field of the alert that is generally used to specify which domain the Source field of the alert<br>
  Default: empty

- **Note** - Additional note that will be added while creating the alert<br>
  Default: empty

- **Priority** - Priority level of the alert. Possible values are P1, P2, P3, P4 and P5<br>
  Default: empty

- **Responders** - Teams, users, escalations and schedules that the alert will be routed to send notifications<br>
  Default: empty

- **Source** - Source field of the alert<br>
  Default: empty

- **Tags** - Tags of the alert<br>
  Default: empty

- **User** - Display name of the request owner<br>
  Default: empty

- **VisibleTo** - Teams and users that the alert will become visible to without sending any notification<br>
  Default: empty

## Creating a REST API endpoint in OpsGenie

1. Open up the Integration List page by clicking on _Settings => Integration List_ within the menu

<a href="/image/opsgenie/1.png" target="_blank">
   <img src="/image/opsgenie/1.png" alt="Screenshot 1: Open up the Integration List page" />
</a>

2. Click _API => Add_

3. Make sure _Create and Update Access_ and _Enabled_ are checked and click _Save Integration_

<a href="/image/opsgenie/2.png" target="_blank">
   <img src="/image/opsgenie/2.png" alt="Screenshot 2: Click API => Add" />
</a>

4. Copy the _API Key_

5. Format the service URL

The host can be either api.opsgenie.com or api.eu.opsgenie.com depending on the location of your instance. See
the [OpsGenie documentation](https://docs.opsgenie.com/docs/alert-api) for details.

<pre class="bk">
opsgenie://api.opsgenie.com/eb243592-faa2-4ba2-a551q-1afdf565c889
                            └───────────────────────────────────┘
                                           token
</pre>

<!-- ## Passing parameters via code

If you want to, you can pass additional parameters to the `send` function.
<br/>
The following example contains all parameters that are currently supported.

```go
service.Send("An example alert message", &types.Params{
    "alias":       "Life is too short for no alias",
    "description": "Every alert needs a description",
    "responders":  `[{"id":"4513b7ea-3b91-438f-b7e4-e3e54af9147c","type":"team"},{"name":"NOC","type":"team"}]`,
    "visibleTo":   `[{"id":"4513b7ea-3b91-438f-b7e4-e3e54af9147c","type":"team"},{"name":"rocket_team","type":"team"}]`,
    "actions":     "An action",
    "tags":        "tag1 tag2",
    "details":     `{"key1": "value1", "key2": "value2"}`,
    "entity":      "An example entity",
    "source":      "The source",
    "priority":    "P1",
    "user":        "Dracula",
    "note":        "Here is a note",
})
``` -->

## Example

<pre class="bk">
opsgenie://api.opsgenie.com/eb243592-faa2-4ba2-a551q-1afdf565c889?alias=Life+is+too+short+for+no+alias&description=Every+alert+needs+a+description&actions=An+action&tags=["tag1","tag2"]&entity=An+example+entity&source=The+source&priority=P1&user=Dracula&note=Here+is+a+note
</pre>
