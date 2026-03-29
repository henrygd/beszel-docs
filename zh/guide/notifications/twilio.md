# Twilio

<https://shoutrrr.nickfedor.com/services/sms/twilio/>

## URL 格式

<span class="bk">twilio://**`accountSID`**:**`authToken`**@**`fromNumber`**/**`toNumber`**[/**`toNumber2`**/...]</span>

## URL 字段

- **AccountSID** - Twilio Account SID (**必填**)  
  URL 部分: <code class="service-url">twilio://<strong>accountsid</strong>:authtoken@fromnumber/tonumbers/</code>
- **AuthToken** - Twilio Auth Token (**必填**)  
  URL 部分: <code class="service-url">twilio://accountsid:<strong>authtoken</strong>@fromnumber/tonumbers/</code>
- **FromNumber** - 发送者电话号码或消息服务 SID (**必填**)  
  URL 部分: <code class="service-url">twilio://accountsid:authtoken@<strong>fromnumber</strong>/tonumbers/</code>
- **ToNumbers** - 接收者电话号码 (**必填**)  
  URL 部分: <code class="service-url">twilio://accountsid:authtoken@fromnumber/<strong>tonumbers</strong>/</code>

## 快速开始

要使用 Twilio SMS 服务，您需要一个 Twilio 账户。您可以在 [twilio.com](https://www.twilio.com/) 注册。

### 所需凭据

1. **Account SID** — 在您的 [Twilio 控制台仪表板](https://console.twilio.com/) 中找到
2. **Auth Token** — 在您的 [Twilio 控制台仪表板](https://console.twilio.com/) 中找到
3. **From Number** — 您账户中的 Twilio 电话号码 **或** 消息服务 SID
4. **To Number(s)** — 一个或多个 [E.164 格式](https://www.twilio.com/docs/glossary/what-e164) 的接收者电话号码

### 电话号码格式

电话号码应采用 [E.164 格式](https://www.twilio.com/docs/glossary/what-e164)（例如 `+15551234567`）。常用的格式化字符（如空格、破折号、括号和点）会自动去除，因此 `+1 (555) 123-4567` 和 `+1.555.123.4567` 也被接受。

### 多个接收者

您可以通过在 URL 路径中添加额外的电话号码来向多个接收者发送同一条消息：

`twilio://ACXX...XX:token@+15551234567/+15559876543/+15551111111/+15552222222`

每个接收者都会收到独立的 API 调用。如果一个接收者的发送失败，仍会尝试发送给其余接收者，并将所有错误一起返回。

### 消息服务 SID

您可以使用 [Twilio 消息服务 SID](https://www.twilio.com/docs/messaging/services) 作为发送者，而不是电话号码。消息服务 SID 以 `MG` 开头：

`twilio://ACXX...XX:token@MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/+15559876543`

当您希望 Twilio 管理发送者选择、退订处理或从号码池发送时，这非常有用。
