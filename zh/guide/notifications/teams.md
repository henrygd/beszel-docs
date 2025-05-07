# Teams

::: warning 仅支持新的 webhook URL 格式

Shoutrrr 现在只支持带有特定组织域名的新 Teams webhook URL 格式。

您必须使用以下方式指定您的组织域名：

<span class="bk">?host=example.webhook.office.com</span>

其中 `example` 是您组织的简称。

不再支持旧版 webhook 格式（例如，`outlook.office.com`）。

:::

## URL 格式

<span class="bk">teams://<strong><code>group</code></strong>@<strong><code>tenant</code></strong>/<strong><code>altId</code></strong>/<strong><code>groupOwner</code></strong>/<strong><code>extraId</code></strong>?<strong><code>host</code></strong>=<strong><code>organization</code></strong>.webhook.office.com[&<strong><code>color</code></strong>=color]</span>

其中：

- `group`：webhook URL 中的第一个 UUID 组件。
- `tenant`：webhook URL 中的第二个 UUID 组件。
- `altId`：webhook URL 中的第三个组件（十六进制字符串）。
- `groupOwner`：webhook URL 中的第四个 UUID 组件。
- `extraId`：webhook URL 末尾的第五个组件。
- `organization`：webhook 域名的组织名称（必填）。
- `color`：消息卡片的可选十六进制颜色代码（例如，`FF0000` 表示红色）。

## 设置 webhook

要使用 Microsoft Teams 通知服务，您需要设置自定义传入 webhook。请按照[此 Microsoft 指南](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook#create-an-incoming-webhook)中的说明进行操作。

## 提取令牌

令牌从您的 webhook URL 中提取：

<span class="bk">https://<b>&lt;organization&gt;</b>.webhook.office.com/webhookb2/<b>&lt;group&gt;</b>@<b>&lt;tenant&gt;</b>/IncomingWebhook/<b>&lt;altId&gt;</b>/<b>&lt;groupOwner&gt;</b>/<b>&lt;extraId&gt;</b></span>

webhook URL 的所有部分都是必需的：

- `organization`：您的组织名称（例如，`contoso`）。
- `group`：第一个 UUID 组件。
- `tenant`：第二个 UUID 组件。
- `altId`：第三个组件（十六进制字符串）。
- `groupOwner`：第四个 UUID 组件。
- `extraId`：第五个组件。

## 示例

```ini
# 原始 webhook URL：
https://contoso.webhook.office.com/webhookb2/11111111-4444-4444-8444-cccccccccccc@22222222-4444-4444-8444-cccccccccccc/IncomingWebhook/33333333012222222222333333333344/44444444-4444-4444-8444-cccccccccccc/V2ESyij_gAljSoUQHvZoZYzlpAoAXExyOl26dlf1xHEx05

# Shoutrrr URL：
teams://11111111-4444-4444-8444-cccccccccccc@22222222-4444-4444-8444-cccccccccccc/33333333012222222222333333333344/44444444-4444-4444-8444-cccccccccccc/V2ESyij_gAljSoUQHvZoZYzlpAoAXExyOl26dlf1xHEx05?host=contoso.webhook.office.com&color=FF0000
```

在此示例中，`color=FF0000` 设置红色主题。
