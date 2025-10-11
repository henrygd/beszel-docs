# Ntfy

上游文档: https://docs.ntfy.sh/publish/

## URL 格式

授权可以使用用户名和密码或访问令牌。

### 用户名和密码

<span class="bk">ntfy://**`username`**:**`password`**@**`host`**/**`topic`**</span>

### 访问令牌

如果使用访问令牌，您不需要提供用户名或密码。

<span class="bk">ntfy://:**`accesstoken`**@**`host`**/**`topic`**</span>

> 注意访问令牌前面的冒号。

## URL 字段

- **Username** - 认证用户名<br>
  默认值: 空<br>
  URL 部分: <code>ntfy://<strong>username</strong>:password@host/topic</code>

- **Password** - 认证密码<br>
  默认值: 空<br>
  URL 部分: <code>ntfy://username:<strong>password</strong>@host/topic</code>

- **Access Token** - 认证访问令牌<br>
  默认值: 空<br>
  URL 部分: <code>ntfy://:<strong>accesstoken</strong>@host/topic</code>

- **Host** - 服务器主机名和端口<br>
  默认值: ntfy.sh<br>
  URL 部分: <code>ntfy://username:password@<strong>host</strong>/topic</code>

- **Topic** - 目标主题名称（必填）<br>
  URL 部分: <code>ntfy://username:password@host/<strong>topic</strong></code>

## 查询参数

- **Actions** - 通知的自定义用户操作按钮，参见 https://docs.ntfy.sh/publish/#action-buttons<br>
  默认值: 空

- **Attach** - 附件的 URL，参见通过 URL 附加<br>
  默认值: 空

- **Cache** - 缓存消息<br>
  默认值: ✔ yes

- **Click** - 点击通知时打开的网站<br>
  默认值: 空

- **Delay** - 延迟发送的时间戳或持续时间，参见 https://docs.ntfy.sh/publish/#scheduled-delivery<br>
  默认值: 空

- **Email** - 用于电子邮件通知的电子邮件地址<br>
  默认值: 空

- **Filename** - 附件的文件名<br>
  默认值: 空

- **Firebase** - 发送到 Firebase<br>
  默认值: ✔ yes

- **Icon** - 用作通知图标的 URL<br>
  默认值: 空

- **Priority** - 消息优先级，1=min，3=default，5=max<br>
  默认值: default
  可能的值: Min, Low, Default, High, Max

- **Scheme** - 服务器协议，http 或 https<br>
  默认值: https

- **Tags** - 可能映射到表情符号的标签列表<br>
  默认值: 空
