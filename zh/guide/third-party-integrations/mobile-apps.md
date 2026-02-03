# 移动端应用

Beszel 的非官方移动端客户端由第三方维护。使用前需要有一台可从您的设备访问的 Beszel 实例（例如通过互联网或局域网）。

## Beszel Companion（iOS）

**Beszel Companion** 是 Beszel 的非官方原生 iOS 客户端。

- **GitHub：** [Loriage/Beszel-Swift-App](https://github.com/Loriage/Beszel-Swift-App)
- **App Store：** [Beszel on the App Store](https://apps.apple.com/us/app/beszel/id6747600765)

### 功能特点

- **多实例支持** — 在一个应用中连接并切换多个 Beszel hub 实例（如工作、家庭、个人）。
- **安全连接** — 通过 Beszel 实例的 API 连接，凭据存储在 iOS 钥匙串中。
- **自定义仪表盘** — 将常用图表（系统 CPU、容器内存等）固定到主屏。
- **系统统计** — 主机系统的 CPU、内存和温度历史数据。
- **容器统计** — 浏览 Docker 容器并查看 CPU 和内存使用历史。
- **交互式图表** — 使用 Swift Charts 构建，支持时间范围筛选（如最近 1 小时、24 小时、7 天）。
- **小组件** — 主屏小组件便于快速查看。
- **SSO 支持** — 可使用 Beszel 上配置的 SSO 登录。请在 SSO 提供商的 redirect URIs 中添加 `beszel-companion://redirect`。

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

## 汇总

| 应用               | 平台         | 来源 / 商店 |
|--------------------|--------------|-------------|
| Beszel Companion   | iOS          | [App Store](https://apps.apple.com/us/app/beszel/id6747600765) · [GitHub](https://github.com/Loriage/Beszel-Swift-App) |
| Beszel Mobile      | Android、iOS | [GitHub](https://github.com/bayroqdor/beszel-android)（发布页中的 APK / IPA） |

以上项目与 Beszel 官方项目无隶属关系。问题反馈与功能建议请前往各自 GitHub 仓库。
