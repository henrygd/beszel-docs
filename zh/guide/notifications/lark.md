# Lark

使用自定义机器人 webhook 发送通知到 Lark。

## URL 格式

<span class="bk">lark://**`host`**/**`token`**?secret=**`secret`**</span>

## URL 字段

- `host`: 机器人 API 主机（Lark 使用 `open.larksuite.com`，飞书使用 `open.feishu.cn`）。
- `token`: 机器人 webhook 令牌（必需）。
- `secret`: 可选的机器人密钥，用于签名请求。

## URL 示例

<span class="bk">lark://open.larksuite.com/abc123?secret=xyz789</span>

## 在 Lark 中创建自定义机器人

官方文档：[自定义机器人指南](https://open.larksuite.com/document/client-docs/bot-v3/add-custom-bot)

1. **邀请自定义机器人到群组**：  
   a. 打开目标群组，点击右上角的`更多`，然后选择`设置`。  
   b. 在`设置`面板中，点击`群机器人`。  
   c. 在`群机器人`下点击`添加机器人`。  
   d. 在`添加机器人`对话框中，找到`自定义机器人`并选择它。  
   e. 设置机器人的名称和描述，然后点击`添加`。  
   f. 复制 webhook 地址并点击`完成`。

2. **获取主机和令牌**：

   - 对于 **Lark**：使用 `host = open.larksuite.com`。
   - 对于 **飞书**：使用 `host = open.feishu.cn`。
   - `token` 是 webhook URL 的最后一段。  
     例如，在 `https://open.larksuite.com/open-apis/bot/v2/hook/xxxxxxxxxxxxxxxxx` 中，令牌是 `xxxxxxxxxxxxxxxxx`。

3. **获取密钥（可选）**：  
   a. 在群组设置中，打开机器人列表，找到你的自定义机器人，选择它以访问其配置。  
   b. 在`安全设置`下，启用`签名校验`。  
   c. 点击`复制`保存密钥。  
   d. 点击`保存`应用更改。
