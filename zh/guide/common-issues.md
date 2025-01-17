# 常见问题

## 代理程序未连接

请查看 PocketBase 中的日志页面 (`/_/#/logs`) 以获取有关错误的信息。

最可能的原因是防火墙阻止了连接请求。在这种情况下，您有两个选择：

1. 在代理系统的防火墙中添加入站规则，以允许 TCP 连接到该端口。检查所有活动的防火墙，例如 iptables，以及您的云服务提供商的防火墙设置（如果适用）。
2. 或者，使用 WireGuard、Tailscale（[视频教程](https://www.youtube.com/watch?v=O_9wT-5LoHM)）或 Cloudflare Tunnel（[教程](https://github.com/henrygd/beszel/discussions/250)）等软件安全地绕过防火墙。

您可以通过在网络中的另一台设备上运行 `telnet <代理IP> <端口>` 来测试连接性。

## 在同一系统上使用 Docker 连接中心和代理

如果为代理程序使用主机网络模式，但不为中心使用，请使用主机名 `host.docker.internal` 添加您的系统，该主机名解析为主机使用的内部 IP 地址。有关完整的 `docker-compose.yml` 示例，请参阅 [入门](./getting-started.md) 指南。

如果都使用主机网络模式，则可以使用 `localhost` 作为主机名。

否则，如果两者都在同一个 Docker 网络中，请使用代理程序的 `container_name` 作为主机名。

## 查找正确的文件系统

使用 `FILESYSTEM` 环境变量指定用于根磁盘统计的文件系统/设备/分区。

如果没有设置，代理程序将尝试找到挂载在 `/` 上的分区并使用它。这在容器中可能无法正常工作，因此建议设置此值。使用以下方法之一查找正确的文件系统：

- 运行 `lsblk` 并选择 "NAME" 下的选项。
- 运行 `df -h` 并选择 "Filesystem" 下的选项。
- 运行 `sudo fdisk -l` 并选择 "Device" 下的选项。

## Docker 容器图表为空或丢失

如果容器图表显示为空数据或根本不显示，您可能需要启用 cgroup 内存记帐。要进行验证，请运行 `docker stats`。如果显示内存使用率为零，请遵循以下指南解决问题：

<https://akashrajpurohit.com/blog/resolving-missing-memory-stats-in-docker-stats-on-raspberry-pi/>

## Docker 容器填充不可靠

如果可能，请升级代理程序系统上的 Docker 版本。Docker 24 及更早版本可能存在导致此问题的错误。我们已经向代理程序添加了缓解此问题的解决方法，但这不是完美的解决方案。

## 月/周记录填充不可靠

较长时间段的记录是通过平均较短时期的统计数据创建的。代理程序必须不间断运行才能使这些记录填充完整的数据集。

暂停/取消暂停代理程序超过一分钟将导致数据不完整，重置当前间隔的计时。
