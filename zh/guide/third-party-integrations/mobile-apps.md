# 移动端应用

Beszel 的非官方移动端客户端由第三方维护。使用前需要有一台可从您的设备访问的 Beszel 实例（例如通过互联网或局域网）。

## Beszel Companion（iOS）

**Beszel Companion** 是 Beszel 的非官方原生 iOS 客户端。

- **GitHub：** [Loriage/Beszel-Swift-App](https://github.com/Loriage/Beszel-Swift-App)
- **App Store：** [Beszel on the App Store](https://apps.apple.com/us/app/beszel/id6747600765)

### 功能特点

- **自定义仪表盘** — 将常用图表固定到主屏，并支持搜索与排序。
- **系统统计** — 支持几乎所有 Beszel 指标的图表：CPU、内存、交换分区、磁盘、网络、温度、GPU 等。
- **容器统计** — CPU、内存和网络使用情况，以及日志和详情。
- **交互式图表** — 支持时间范围筛选（最近 1 小时、24 小时、7 天等）。
- **警报与通知** — 查看活动警报，并在系统离线或触发阈值（CPU、内存、温度、GPU 等）时接收推送通知。
- **多实例支持** — 在一个应用中管理多个 Beszel hub。
- **小组件** — 支持主屏幕与锁定屏幕小组件。
- **安全连接** — 支持 SSO / OAuth、使用客户端证书的 mTLS、2FA，以及使用系统钥匙串存储凭据。请在 SSO 提供商的 redirect URIs 中添加 `beszel-companion://redirect`。
- **完善体验** — 支持面容 ID / 密码锁定及主题切换。
- **本地化** — 支持英语、法语和波兰语。[在 Crowdin 上参与翻译](https://crowdin.com/project/beszel-swift-app)。

### 安装

- 从 [App Store](https://apps.apple.com/us/app/beszel/id6747600765) 安装，或
- 从 [发布页](https://github.com/Loriage/Beszel-Swift-App/releases) 下载并侧载 `.ipa`。

::: tip
通过侧载 `.ipa` 安装时，主屏小组件无法使用。如需完整功能，请使用 App Store 版本。
:::

## Beszel Mobile（Android 与 iOS）

**Beszel Mobile** 是 Beszel 的跨平台客户端（基于 Flutter），支持 Android 和 iOS。

- **GitHub：** [bayroqdor/beszel-android](https://github.com/bayroqdor/beszel-android)

### 功能特点

- **仪表盘** — 实时查看服务器状态、CPU、内存和磁盘使用情况。
- **详细监控** — 任务管理器式视图、每核 CPU 以及各接口的网络流量（上传/下载）。
- **安全** — PIN 锁与生物识别解锁（指纹或面容 ID）。
- **历史记录** — CPU、内存、磁盘和网络使用的交互式图表（例如最多 24 小时，视服务器而定）。
- **多平台** — 针对 Android 和 iOS 优化（iOS 14+）。
- **TrollStore** — 为 TrollStore 用户提供未签名 IPA 构建。

### 安装

**Android：** 从 [发布页](https://github.com/bayroqdor/beszel-android/releases) 下载最新 APK。

**iOS：**

- **TrollStore：** 从发布页下载 `Beszel.ipa`，通过 TrollStore 安装。
- **标准安装：** 使用 AltStore、Sideloadly 或开发者账号自行签名并安装（构建说明见[项目 README](https://github.com/bayroqdor/beszel-android?tab=readme-ov-file)）。

## Homelab Dashboard（Android 与 iOS）

**Homelab Dashboard** 是一款管理家庭实验室的原生双平台应用，集成了 Beszel、Portainer、Pi-hole 和 Gitea。

- **GitHub：** [JohnnWi/homelab-project](https://github.com/JohnnWi/homelab-project)

### 功能特点

- **Beszel 监控** — 监控所有连接节点的 CPU、内存和磁盘使用情况。
- **多服务支持** — 统一管理 Portainer、Pi-hole、Gitea 和 Beszel 的仪表盘。
- **原生 UI** — iOS（Swift 6 + SwiftUI）和 Android（Kotlin + Jetpack Compose）。
- **本地化** — 英语、意大利语、法语、西班牙语和德语。

### 安装

**iOS：** 通过 Xcode 16.0+ 从源码构建（打开 `HomelabSwift/Homelab.xcodeproj`）。
**Android：** 从 [发布页](https://github.com/JohnnWi/homelab-project/releases) 下载 APK 或通过 Android Studio 构建。

## 汇总

| 应用              | 平台         | 来源 / 商店                                                               |
| ---------------- | ------------ | ------------------------------------------------------------------------- |
| Beszel Companion | iOS          | [App Store](https://apps.apple.com/us/app/beszel/id6747600765) · [GitHub](https://github.com/Loriage/Beszel-Swift-App) |
| Beszel Mobile    | Android、iOS | [GitHub](https://github.com/bayroqdor/beszel-android)（发布页中的 APK / IPA） |
| Homelab Dashboard | Android、iOS | [GitHub](https://github.com/JohnnWi/homelab-project)（APK / 从源码构建） |

以上项目与 Beszel 官方项目无隶属关系。问题反馈与功能建议请前往各自 GitHub 仓库。
