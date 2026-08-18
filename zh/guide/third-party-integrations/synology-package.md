# Synology NAS Agent 软件包

Beszel Agent 可以作为 Synology 软件包安装到任何 Synology NAS 上。这样一来，即使设备不支持 Docker，也可以运行代理，并且能与 Synology 的 DSM 操作系统更好地集成。

该软件包及本文档最初由 [not-first](https://github.com/not-first/) 创建，并在维护者的帮助下发布到 [SynoCommunity 软件包仓库](https://synocommunity.com/package/beszel-agent)。相关代码是开源的，可在 [GitHub](https://github.com/SynoCommunity/spksrc/tree/master/spk/beszel-agent) 上查看。

## 开始之前

### 添加 SynoCommunity 仓库

::: info **如果使用 DSM6 或更低版本**

   以管理员身份登录 NAS，然后前往：
   - 主菜单 → 套件中心 → 设置
   - 将信任级别设置为“Synology Inc. 和受信任的发布者”
:::

在套件中心设置的“套件来源”选项卡中：
- 点击 **新增**
- 将名称填写为 `SynoCommunity`
- 将位置填写为 `https://packages.synocommunity.com/`
- 点击 **确定** 进行验证

## 安装 Beszel Agent 软件包

1. 打开套件中心，进入 **社区** 选项卡
2. 搜索 `beszel agent`
3. 点击 **安装**

- 或者，也可以从 [SynoCommunity](https://synocommunity.com/package/beszel-agent) 下载最新版本的软件包，然后在套件中心点击 **手动安装**。

安装后会立即显示配置界面。有关如何填写这些设置，请参阅下一节。

## 配置 Beszel Agent

安装过程中，系统会要求您输入 Beszel Agent 的配置详细信息。

<a href="/image/synology-agent-package-setup-ui.png" target="_blank">
   <img src="/image/synology-agent-package-setup-ui.png" height="146" width="554" alt="Beszel Agent 软件包配置界面" />
</a>

#### 公钥

**必填。** 输入 Beszel Agent 的公钥。

::: info
   如果要使用 WebSocket 连接，请在下方的“其他环境变量”字段中指定 `HUB_URL` 和 `TOKEN` 环境变量，并将此字段留空。
:::

#### 要监控的文件系统

**可选。** 设置 `EXTRA_FILESYSTEMS` 环境变量的值。有关更多信息，请参阅[相关文档](../additional-disks#binary-agent)。

建议填写此项，因为 Beszel Agent 默认只监控根文件系统（`/`），而根文件系统可能不包含 NAS 上的所有磁盘。请使用 `/volume{n}__Label` 格式指定要监控的其他文件系统，并以逗号分隔。如果连接了外部 USB 驱动器，可以使用 `/volumeUSB{n}/usbshare__Label` 格式指定。

**示例：** `/volume1__Main Storage,/volumeUSB1/usbshare__External Backup`

#### SMART 监控

**可选。** 设置 `ENABLE_SMART` 环境变量的值。有关更多信息，请参阅[相关文档](../environment-variables#smart-devices)。留空则禁用 SMART 监控。

::: warning
设置此变量后，需要执行一些步骤，以确保 Beszel Agent 具有读取硬盘 SMART 数据所需的权限。

1. 从 SynoCommunity 仓库安装 `SynoCli Disk Tools` 软件包。
2. 通过 SSH 会话或手动任务，在 NAS 上运行以下命令：
   `sed -i 's/package/root/g' /var/packages/beszel-agent/conf/privilege`

*此操作需要在安装后以及每次软件包更新后执行；修改权限文件后必须重启 Beszel Agent。可以使用计划任务在启动时自动执行此过程。*
:::

请使用 `/dev/sd{x}:sat` 格式指定硬盘，并以逗号分隔。您可以在 NAS 终端中运行 `/usr/local/bin/smartctl --scan` 查看硬盘。为了让 Beszel 能够读取 SMART 数据，必须添加 `:sat` 后缀，即使硬盘本身并非 `sat` 类型也应如此。

**示例：** `/dev/sda:sat,/dev/sdb:sat,/dev/sdc:sat`

- `/dev/sda:sat` 表示硬盘 1
- `/dev/sdb:sat` 表示硬盘 2
- `/dev/sdr:sat` 通常用于外部 USB 硬盘

::: info
虽然您的硬盘可能不是 `sat` 类型，但这似乎是 Synology `smartctl` 读取 SMART 数据所需的格式 🤷。
:::

---

#### 其他环境变量

**可选。** 您可以使用以分号分隔的列表设置其他环境变量，以便按需配置代理。

例如，如果想使用 WebSocket 连接而不是默认的 SSH，可以在此处设置 `HUB_URL=<url>;TOKEN=<token>`。
