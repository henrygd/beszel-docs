# OAuth / OIDC

You can authenticate users with an OAuth2 provider, like GitHub or Google, or a custom OpenID Connect provider, like Authelia or Zitadel.

:::tip Redirect URL
When creating your OAuth2 app, use **`<your-beszel-url>/api/oauth2-redirect`** as the callback/redirect URL.
:::

## Setup

1. Toggle off the "Hide collection create and edit controls" switch on `/_/#/settings`.

[![hide-collection-create-and-edit-controls](/image/edit-toggle-off.png)](/image/edit-toggle-off.png)

2. Edit the `users` collection.

[![edit-users-collection](/image/edit-users-collection.png)](/image/edit-users-collection.png)

3. In the "Options" tab, enable OAuth2 and add your provider.

[![edit-users-collection-options](/image/oauth-settings.png)](/image/oauth-settings.png)

4. Toggle the switch back on in `/_/#/settings`.

[![hide-collection-create-and-edit-controls](/image/edit-toggle-on.png)](/image/edit-toggle-on.png)

## Disable password login

To disable password login, set `DISABLE_PASSWORD_AUTH=true` in the hub environment variables.

Please avoid changing this setting directly in PocketBase as it will be overridden by the value of `DISABLE_PASSWORD_AUTH` on the next restart.

## Automatic user creation

Beszel does not allow automatic user creation by default. To enable it, set `USER_CREATION=true` in the hub environment variables.

## Supported providers

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
