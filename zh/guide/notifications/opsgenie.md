# OpsGenie

## URL 格式

<span class="bk">opsgenie://[__`host`__:__`port`__/]**`apikey`**</span>

## URL 字段

- **Host** - OpsGenie API 主机。欧盟实例使用 'api.eu.opsgenie.com'<br>
  默认值: `api.opsgenie.com`<br>
  URL 部分: <code>opsgenie://<strong>host</strong>:port/apikey</code>

- **Port** - OpsGenie API 端口<br>
  默认值: `443`<br>
  URL 部分: <code>opsgenie://host:<strong>port</strong>/apikey</code>

- **APIKey** - OpsGenie API 密钥（必填）<br>
  URL 部分: <code>opsgenie://host:port/<strong>apikey</strong></code>

## 查询/参数属性

属性可以通过 URL 查询参数提供: `?key=value&key=value` 等。

- **Actions** - 警报可用的自定义操作<br>
  默认值: empty

- **Alias** - 客户端定义的警报标识符<br>
  默认值: empty

- **Description** - 警报的描述字段<br>
  默认值: empty

- **Entity** - 警报的实体字段，通常用于指定警报的源字段的域<br>
  默认值: empty

- **Note** - 创建警报时将添加的附加说明<br>
  默认值: empty

- **Priority** - 警报的优先级。可能的值为 P1, P2, P3, P4 和 P5<br>
  默认值: empty

- **Responders** - 警报将路由发送通知的团队、用户、升级和计划<br>
  默认值: empty

- **Source** - 警报的源字段<br>
  默认值: empty

- **Tags** - 警报的标签<br>
  默认值: empty

- **User** - 请求所有者的显示名称<br>
  默认值: empty

- **VisibleTo** - 警报将对其可见但不发送任何通知的团队和用户<br>
  默认值: empty

## 在 OpsGenie 中创建 REST API 端点

1. 通过点击菜单中的 _Settings => Integration List_ 打开集成列表页面

<a href="/image/opsgenie/1.png" target="_blank">
   <img src="/image/opsgenie/1.png" alt="截图 1: 打开集成列表页面" />
</a>

2. 点击 _API => Add_

3. 确保勾选 _Create and Update Access_ 和 _Enabled_，然后点击 _Save Integration_

<a href="/image/opsgenie/2.png" target="_blank">
   <img src="/image/opsgenie/2.png" alt="截图 2: 点击 API => Add" />
</a>

4. 复制 _API Key_

5. 格式化服务 URL

主机可以是 api.opsgenie.com 或 api.eu.opsgenie.com，取决于您实例的位置。详情请参阅
[OpsGenie 文档](https://docs.opsgenie.com/docs/alert-api)。

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

## 示例

<pre class="bk">
opsgenie://api.opsgenie.com/eb243592-faa2-4ba2-a551q-1afdf565c889?alias=Life+is+too+short+for+no+alias&description=Every+alert+needs+a+description&actions=An+action&tags=["tag1","tag2"]&entity=An+example+entity&source=The+source&priority=P1&user=Dracula&note=Here+is+a+note
</pre>
