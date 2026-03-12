# 桌面端应用

Beszel 的非官方桌面客户端由第三方维护。使用前需要有一台可从您的设备访问的 Beszel 实例。

## BeszelBar (macOS)

**BeszelBar** 是 Beszel 的非官方原生 macOS 菜单栏客户端。

- **GitHub:** [Loriage/BeszelBar](https://github.com/Loriage/BeszelBar)

### 功能特点

- **系统概览** — 一目了然查看所有服务器的状态、CPU、内存和磁盘使用情况。
- **系统详情** — 悬停查看运行时间、温度和详细的使用条。
- **容器监控** — 查看 Docker 容器的运行状态、资源占用和镜像信息。
- **警报** — 查看活动警报及其触发条件，并反映在菜单栏图标上。
- **多 Hub 支持** — 管理多个 Beszel 实例（例如工作、家庭、个人）并轻松切换。
- **自动刷新** — 可配置的轮询间隔，范围从 10 秒到 5 分钟。
- **完善体验** — 原生 SwiftUI + AppKit 开发，使用系统钥匙串（Keychain）存储凭据，并经过签名和公证。

### 安装

- 通过 Homebrew 安装：`brew install --cask loriage/tap/beszelbar`，或者
- 从 [发布页 (Releases)](https://github.com/Loriage/BeszelBar/releases) 下载最新版本。
