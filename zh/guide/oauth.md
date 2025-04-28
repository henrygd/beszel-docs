# OAuth / OIDC 认证

您可以使用 OAuth2 提供商（例如 GitHub 或 Google）或自定义 OpenID Connect 提供商（例如 Authelia 或 Zitadel）来验证用户身份。

::: tip 重定向 URL
创建 OAuth2 应用时，请将 **`<您的 Beszel URL>/api/oauth2-redirect`** 用作回调/重定向 URL。
:::

## 设置

1. 在 `/_/#/settings` 中关闭"隐藏收藏创建和编辑控件"开关。

[![隐藏收藏创建和编辑控件](/image/edit-toggle-off.png)](/image/edit-toggle-off.png)

2. 编辑"用户"集合。

[![编辑用户集合](/image/edit-users-collection.png)](/image/edit-users-collection.png)

3. 在"选项"标签中，启用 OAuth2 并添加您的提供商。

[![编辑用户集合选项](/image/oauth-settings.png)](/image/oauth-settings.png)

4. 在 `/_/#/settings` 中重新打开开关。

[![隐藏收藏创建和编辑控件](/image/edit-toggle-on.png)](/image/edit-toggle-on.png)

## 禁用密码登录

要禁用密码登录，请在中心的环境变量中设置 `DISABLE_PASSWORD_AUTH=true`。

请不要直接在 PocketBase 中更改此设置，因为它将在下次重启时被 `DISABLE_PASSWORD_AUTH` 的值覆盖。

## 自动用户创建

Beszel 默认情况下不允许自动创建用户。要启用它，请在中心的环境变量中设置 `USER_CREATION=true`。

## 支持的提供商

- Apple
- Bitbucket
- Discord
- Facebook
- Gitea
- Gitee
- GitHub
- GitLab
- Google
- Instagram
- Kakao
- Linear
- LiveChat
- mailcow
- Microsoft
- monday.com
- Notion
- OpenID Connect
- Patreon (v2)
- Spotify
- Strava
- Trackt
- Twitch
- Twitter
- VK
- WakaTime
- Yandex
