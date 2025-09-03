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

## Supported external providers

These are publicly available identity services offered by major platforms that users can authenticate with using their existing accounts.

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
- Microsoft
- monday.com
- Notion
- Patreon (v2)
- Spotify
- Strava
- Trackt
- Twitch
- Twitter
- VK
- WakaTime
- Yandex
- ZITADEL

## Self-hosted / custom identity providers

These are OpenID Connect (OIDC-compliant) services you can host and manage yourself, typically used to centralize authentication within your own infrastructure or organization.

This is not a complete list, just providers known to work. If you're using something different, feel free to add it!

- [Authelia](https://www.authelia.com/integration/openid-connect/beszel/)
- [authentik](https://integrations.goauthentik.io/monitoring/beszel/)
- Gitea
- GitLab
- Keycloak
- mailcow
- [Pocket ID](https://pocket-id.org/docs/client-examples/beszel)
- ZITADEL
