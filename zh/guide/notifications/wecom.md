# WeCom

使用 webhook 机器人向企业微信（Enterprise WeChat）发送通知。

## URL 格式

<span class="bk">wecom://**`key`**</span>

## 可选查询参数

- **`mentioned_list`** - 要提及的用户（逗号分隔）

- **`mentioned_mobile_list`** - 要提及的手机号码（逗号分隔）

### 示例 URL

<span class="bk">wecom://**`693axxx6-7aoc-4bc4-97a0-0ec2sifa5aaa`**?**`mentioned_list`**=**`@all`**</span>

## 在企业微信中创建 Webhook 机器人

官方文档: [Webhook 机器人指南](https://developer.work.weixin.qq.com/document/path/99110)

1. **创建群组机器人**:
   a. 在 PC 或网页上打开企业微信。
   b. 找到接收通知的目标群组。
   c. 右键单击群组并选择"添加群组机器人"。
   d. 在对话框中，单击"创建机器人"。
   e. 输入自定义机器人名称并单击"添加"。
   f. 您将收到一个 webhook URL。

2. **获取 Webhook 密钥**:

   - webhook URL 将类似于: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXXXXXXXXXXXXXXXXX`
   - `key` 是 URL 中 `?key=` 之后的值。

3. **配置 Shoutrrr**:
   - 在 Shoutrrr URL 中使用密钥: `wecom://YOUR_WEBHOOK_KEY`
