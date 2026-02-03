# Mobile Applications

Unofficial mobile clients for Beszel are maintained by third parties. You need a working Beszel instance accessible from your device (e.g. over the internet or local network) to use them.

## Beszel Companion (iOS)

**Beszel Companion** is an unofficial native iOS client for Beszel.

- **GitHub:** [Loriage/Beszel-Swift-App](https://github.com/Loriage/Beszel-Swift-App)
- **App Store:** [Beszel on the App Store](https://apps.apple.com/us/app/beszel/id6747600765)

### Features

- **Multi-instance support** — Connect to and switch between multiple Beszel hub instances (e.g. work, home, personal) in one app.
- **Secure connection** — Connects to your Beszel instance via its API. Credentials are stored in the iOS Keychain.
- **Custom dashboard** — Pin favorite charts (system CPU, container memory, etc.) to a home screen.
- **System stats** — Historical CPU, memory, and temperature data for host systems.
- **Container stats** — Browse Docker containers and view historical CPU and memory usage.
- **Interactive charts** — Built with Swift Charts; supports time range filtering (e.g. last hour, 24h, 7 days).
- **Widgets** — Home Screen widgets for quick access.
- **SSO support** — Log in via the SSO configured on your Beszel instance. Add `beszel-companion://redirect` to the redirect URIs of your SSO providers.

### Installation

- Install from the [App Store](https://apps.apple.com/us/app/beszel/id6747600765), or
- Sideload the `.ipa` from [releases](https://github.com/Loriage/Beszel-Swift-App/releases).

::: tip
Home Screen widgets do not work when the app is installed by sideloading the `.ipa`. For full functionality, use the App Store version.
:::

## Beszel Mobile (Android & iOS)

**Beszel Mobile** is a cross-platform client for Beszel (Flutter), available on Android and iOS.

- **GitHub:** [bayroqdor/beszel-android](https://github.com/bayroqdor/beszel-android)

### Features

- **Dashboard** — View servers at a glance with real-time status, CPU, memory, and disk usage.
- **Detailed monitoring** — Task-manager style view, per-core CPU, and network traffic (upload/download) for all interfaces.
- **Security** — PIN protection and biometric unlock (fingerprint or Face ID).
- **History** — Interactive charts for CPU, RAM, disk, and network usage (e.g. up to 24h depending on server).
- **Multi-OS** — Optimized for Android and iOS (iOS 14+).
- **TrollStore** — Unsigned IPA builds for TrollStore users.

### Installation

**Android:** Download the latest APK from [Releases](https://github.com/bayroqdor/beszel-android/releases).

**iOS:**

- **TrollStore:** Download the `Beszel.ipa` from Releases and install via TrollStore.
- **Standard:** Sign and install the app yourself using AltStore, Sideloadly, or a developer account (see the [project README](https://github.com/bayroqdor/beszel-android?tab=readme-ov-file) for build instructions).

## Summary

| App               | Platform   | Source / Store |
|-------------------|------------|----------------|
| Beszel Companion  | iOS        | [App Store](https://apps.apple.com/us/app/beszel/id6747600765) · [GitHub](https://github.com/Loriage/Beszel-Swift-App) |
| Beszel Mobile     | Android, iOS | [GitHub](https://github.com/bayroqdor/beszel-android) (APK / IPA in Releases) |

These projects are not affiliated with the official Beszel project. For issues and feature requests, use the respective GitHub repositories.
