# 通用 webhook

通用服务可用于任何 Shoutrrr 未明确支持的目标，只要它支持通过 `POST` 请求接收消息即可。

有时这需要在接收端进行自定义以解析 payload，或使用中间代理来修改 payload。

## URL 格式

<span class="bk">generic://example.com</span>

## 自定义头部

你可以通过添加以 `@` 为前缀的查询变量（`@key=value`）来为请求添加额外的 HTTP 头部。

使用

<span class="bk">generic://example.com?@acceptLanguage=tlh-Piqd</span>

将会添加以下额外的头部：

```http
Accept-Language: tlh-Piqd
```

## JSON 模板

通过使用内置的 `JSON` 模板（`template=json`），你可以创建通用的 JSON payload。

### 示例

```json
{
	"title": "Foo CPU above threshold",
	"message": "CPU averaged 63.53% for the previous 10 minutes."
}
```

### 修改默认键

用于 `title` 和 `message` 的键可以通过提供参数/查询值 `titlekey` 和 `messagekey` 进行覆盖。

<span class="bk">generic://example.com?template=json&titlekey=subject&messagekey=content</span>

```json
{
	"subject": "Foo CPU above threshold",
	"content": "CPU averaged 63.53% for the previous 10 minutes."
}
```

## 自定义数据字段

使用 JSON 模板时，你可以通过添加以 `$` 为前缀的查询变量（`$key=value`）来为 JSON 对象添加额外的键/值对。

### 示例

使用 `generic://example.com?template=json&$projection=retroazimuthal` 将生成：

```json
{
	"title": "Amazing opportunities!",
	"message": "New map book available for purchase.",
	"projection": "retroazimuthal"
}
```

## 转发的查询变量

所有未在 [查询/参数属性](#queryparam_props) 部分列出的查询变量将被
转发到目标端点。

如果你需要传递一个被保留的查询变量，你可以在它前面加上下划线（`_`）。

### 示例

URL `generic://example.com/api/v1/postStuff?contenttype=text/plain` 将使用 `Content-Type: text/plain` 头部向 `https://example.com/api/v1/postStuff` 发送 POST 消息。

如果改为转义，`generic://example.com/api/v1/postStuff?_contenttype=text/plain` 将使用 `Content-Type: application/json` 头部（因为它是默认值）向 `https://example.com/api/v1/postStuff?contenttype=text/plain` 发送 POST 消息。

## 查询/参数属性

参数可以通过 params 参数提供，或者通过 URL 使用  
`?key=value&key=value` 等形式提供。

- **ContentType** - Content-Type 头部的值  
  默认值：`application/json`

- **DisableTLS**  
  默认值：❌ `No`

- **MessageKey** - 用于消息值的键  
  默认值：`message`

- **RequestMethod**  
  默认值：`POST`

- **Template** - 用于创建请求 payload 的模板  
  默认值：_空_

- **TitleKey** - 用于标题值的键  
  默认值：`title`
