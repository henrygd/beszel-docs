# Google Chat

## URL 格式

你的 Google Chat 传入 Webhook URL 看起来像这样：

<span class="bk">http<span>s://chat.</span>googleapis.com/v1/spaces/**`FOO`**/messages?key=**`bar`**&token=**`baz`**</span>

shoutrrr 服务 URL 应该看起来像这样：

<span class="bk">googlechat://chat.googleapis.com/v1/spaces/**`FOO`**/messages?key=**`bar`**&token=**`baz`**</span>

换句话说，就是将传入 webhook URL 中的 `https` 替换为 `googlechat`。

Google Chat 以前被称为 Hangouts Chat。在服务 URL 中使用 `hangouts` 代替 `googlechat` 仍然受支持，但已被弃用。

## 在 Google Chat 中创建传入 webhook

1. 打开你想要添加 Shoutrrr 的聊天室，并打开聊天室菜单。

<a href="/image/googlechat/hangouts-1.png" target="_blank">
   <img src="/image/googlechat/hangouts-1.png" alt="截图 1：打开聊天室菜单" />
</a>

2. 然后点击 _Configure webhooks_（配置 webhooks）。

<a href="/image/googlechat/hangouts-2.png" target="_blank">
   <img src="/image/googlechat/hangouts-2.png" alt="截图 2：点击配置 webhooks" />
</a>

3. 为 webhook 命名并保存。

<a href="/image/googlechat/hangouts-3.png" target="_blank">
   <img src="/image/googlechat/hangouts-3.png" alt="截图 3：为 webhook 命名并保存" />
</a>

4. 复制 URL。

<a href="/image/googlechat/hangouts-4.png" target="_blank">
   <img src="/image/googlechat/hangouts-4.png" alt="截图 4：复制 webhook URL" />
</a>

5. 通过将 `https` 替换为 `googlechat` 来格式化服务 URL。
