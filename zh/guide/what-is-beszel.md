# 什么是 Beszel？

Beszel 是一个轻量级的服务器监控平台，包含 Docker 统计信息、历史数据和警报功能。

它拥有友好的 Web 界面、简单的配置，并且开箱即用。它支持自动备份、多用户、OAuth 身份验证和 API 访问。

<div style="display: flex; flex-wrap: wrap; gap: .5em; margin: 1.6em 0 -.3em">
  <a href="https://hub.docker.com/r/henrygd/beszel-agent" target="_blank">
    <img height="20" width="171" src="https://img.shields.io/docker/image-size/henrygd/beszel-agent/latest?logo=docker&label=代理镜像大小" alt="代理 Docker 镜像大小" />
  </a>
  <a href="https://hub.docker.com/r/henrygd/beszel" target="_blank">
    <img height="20" width="169" src="https://img.shields.io/docker/image-size/henrygd/beszel/latest?logo=docker&label=中心镜像大小" alt="中心 Docker 镜像大小" />
  </a>
  <a href="https://github.com/henrygd/beszel/blob/main/LICENSE" target="_blank">
    <img height="20" width="78" src="https://img.shields.io/github/license/henrygd/beszel?color=%239944ee&label=许可证" alt="MIT 许可证" />
  </a>
  <a href="https://crowdin.com/project/beszel" target="_blank">
    <img height="20" width="97" src="https://badges.crowdin.net/beszel/localized.svg" alt="Crowdin 翻译" />
  </a>
</div>

## 功能

- **轻量级**: 比主要解决方案更小，资源占用更少。
- **简单**: 易于设置，无需公网暴露。
- **Docker 统计**: 跟踪每个容器的 CPU、内存和网络使用历史。
- **警报**: 可配置 CPU、内存、磁盘、带宽、温度、负载平均值和状态的警报。
- **多用户**: 用户管理自己的系统。管理员可以在用户之间共享系统。
- **OAuth / OIDC**: 支持多种 OAuth2 提供程序。可以禁用密码验证。
- **自动备份**: 从磁盘或 S3 兼容的存储保存和恢复数据。
- **电池**: 主机系统电池电量。

## 架构

Beszel 由两个主要组件组成：**中心 (hub)** 和 **代理 (agent)**。

- **中心 (hub)**: 一个基于 [PocketBase](https://pocketbase.io/) 构建的 Web 应用程序，提供用于查看和管理连接系统的仪表板。
- **代理 (agent)**: 在您要监控的每个系统上运行，并将系统指标传递给中心。

## 屏幕截图

<div style="display: grid; gap: 15px;">
  <a href="/image/dashboard.png" target="_blank">
    <img src="/image/dashboard.png" height="967" width="1419" alt="显示多个已连接系统的仪表板页面" />
  </a>
  <a href="/image/system-full.png" target="_blank">
    <img src="/image/system-full.png" height="2551" width="1422" alt="显示详细指标的系统页面" />
  </a>
  <a href="/image/settings-notifications.png" target="_blank">
    <img src="/image/settings-notifications.png" height="928" width="1429" alt="通知设置页面" />
  </a>
</div>

## 支持的指标

- **CPU 使用率** - 主机系统和 Docker / Podman 容器。
- **内存使用率** - 主机系统和容器。包括交换分区和 ZFS ARC。
- **磁盘使用率** - 主机系统。支持多个分区和设备。
- **磁盘 I/O** - 主机系统。支持多个分区和设备。
- **网络使用率** - 主机系统和容器。
- **负载平均值** - 主机系统。
- **温度** - 主机系统传感器。
- **GPU 使用率 / 温度 / 功耗** - 仅限 Nvidia 和 AMD。必须使用二进制代理。
