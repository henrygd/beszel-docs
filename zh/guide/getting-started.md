# 入门指南

## 准备工作

Beszel 由两个主要组件组成：Hub 和 Agent。

- **Hub**：一个提供仪表板的 Web 应用程序，用于查看和管理连接的系统。

- **Agent**：运行在每个你想监控的系统上，创建一个最小的 SSH 服务器，将系统指标传输到 Hub。

:::tip
Beszel 使用主动探测，***Hub*** 请求来自 ***Agent*** 的数据。这种设置要求 ***Agent*** 具有一个开放端口，供 ***Hub*** 访问。如果 ***Agent*** 在公共互联网中，它必须有一个公共 IP 地址，并且开放端口供 ***Hub*** 访问。

无需将 Hub 暴露在公共互联网中；主动模式相对更安全。
:::

## 安装

Beszel 支持通过 Docker 或使用二进制文件进行安装。

- [Docker](./install-hub#docker)
- [二进制文件](./install-hub#binary)