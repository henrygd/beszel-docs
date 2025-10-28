# S.M.A.R.T. 监控

Beszel 从 `smartctl` 解析 S.M.A.R.T. 数据，并在系统页面上显示（如果可用）。这通常需要提升权限。

要确保你的系统兼容，请在代理机器上安装 `smartmontools` 并扫描设备： {#install}


::: code-group

```bash [Debian/Ubuntu]
sudo apt install smartmontools
```

```bash [Fedora]
sudo dnf install smartmontools
```

```bash [Arch]
sudo pacman -S smartmontools
```

```bash [FreeBSD]
pkg install smartmontools
```

```bash [macOS]
brew install smartmontools
```

:::


```bash
sudo smartctl --scan
```

## Docker 代理

切换到 `:alpine` 镜像，并在你的 `docker-compose.yml` 中添加以下内容。请确保将设备名称替换为你的实际设备。

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
   devices:
   - /dev/sda:/dev/sda
   - /dev/nvme0:/dev/nvme0
   cap_add:
   - SYS_RAWIO # S.M.A.R.T. 数据所需
   - SYS_ADMIN # NVMe S.M.A.R.T. 数据所需
```

::: tip 传入基础控制器名称，而不是块设备/分区

注意我们在示例中使用的是 `sda` 和 `nvme0`，而不是 `sda1` 或 `nvme0n1`。

:::

## 二进制代理

确保 `smartctl` 已安装，遵循[安装说明](#install)。

`smartctl` 需要提升权限才能与磁盘通信：

- SATA/ATA 通过 SG_IO 需要 `CAP_SYS_RAWIO`
- NVMe 管理直通需要 `CAP_SYS_ADMIN`

### 推荐：systemd 环境能力

如果你将代理作为 systemd 服务运行，请将能力添加到服务而不是进程以 root 身份运行。

1. 编辑你的服务文件（例如 `/etc/systemd/system/beszel-agent.service`），并在 `[Service]` 下添加以下内容：

```ini
AmbientCapabilities=CAP_SYS_RAWIO CAP_SYS_ADMIN
CapabilityBoundingSet=CAP_SYS_RAWIO CAP_SYS_ADMIN
```

2. 如果你的服务文件中已有 `DeviceAllow` 行（例如用于 Nvidia GPU），你还必须为你的驱动器添加 `DeviceAllow` 规则：

```ini
DeviceAllow=/dev/sda r
DeviceAllow=/dev/nvme0 r
```

3. 重新加载并重启：

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent
```

如果这不起作用，请尝试[将 `beszel` 用户添加到 `disk` 组](#disk-group)。

### 替代方案：smartctl 文件能力（组限制）

如果你不使用 systemd 或不想更改服务，你可以将所需能力添加到 `smartctl` 二进制文件，并限制执行到一个专用组。这让代理用户只需必要的权限即可运行 `smartctl`。

```bash
# 授予 SATA (RAWIO) 和 NVMe (SYS_ADMIN) 所需的权限
sudo setcap cap_sys_rawio,cap_sys_admin+ep "$(command -v smartctl)"

# 可选：将执行限制到一个专用组
sudo groupadd -r smartctl 2>/dev/null || true
sudo chgrp smartctl "$(command -v smartctl)"
sudo chmod 750 "$(command -v smartctl)"

# 将 beszel 服务用户添加到该组
sudo usermod -aG smartctl beszel
```

然后重启代理。注意：如果你的 systemd 单元设置了 `NoNewPrivileges=yes`，添加到 `smartctl` 的文件能力将无法被代理使用。

### FreeBSD

将代理用户添加到 `operator` 组以便访问磁盘设备：

```sh
pw groupmod operator -m beszel
service beszel-agent restart
```

### 验证权限

测试 `smartctl` 在代理用户下是否无需 sudo 即可工作：

```bash
sudo -u beszel smartctl -H /dev/sda
sudo -u beszel smartctl -H /dev/nvme0
```

如果这些命令成功，代理将能够解析 S.M.A.R.T. 数据。

## Windows

从官方 SourceForge 页面下载并安装 `smartmontools`：

1. 访问 [https://sourceforge.net/projects/smartmontools/files/](https://sourceforge.net/projects/smartmontools/files/)
2. 下载最新的 Windows 安装程序（`.exe` 文件）
3. 以管理员身份运行安装程序
4. 按照安装向导完成设置

安装后，验证 `smartctl` 是否可从命令行访问：

```cmd
smartctl --version
```

### 将 smartctl 添加到 PATH

::: details 点击展开/折叠

如果你的系统找不到 `smartctl` 可执行文件，你需要手动将 smartmontools 安装目录添加到系统的 PATH 环境变量中。

要将 smartctl 添加到你的 PATH：

1. 打开**编辑系统环境变量**对话框：
   - 按 `Win + R`，输入 `sysdm.cpl`，按 Enter 并转到高级选项卡。
   - 或在开始菜单中搜索"环境变量"

2. 点击**环境变量...**

3. 在**系统变量**部分，选择 **Path** 并点击**编辑...**

4. 点击**新建**并添加 smartmontools 安装目录：
   ```
   C:\Program Files\smartmontools\bin
   ```

   ::: tip 安装路径可能有所不同
   确切路径取决于你的安装位置。


5. 打开新的命令提示符或 PowerShell 窗口并验证安装：
   ```cmd
   smartctl --version
   ```

:::

### 扫描设备

一旦 `smartctl` 工作正常，扫描可用设备：

```cmd
smartctl --scan
```

代理现在应该能够从你的 Windows 系统收集 S.M.A.R.T. 数据。

## 故障排除

### 尽管设置了能力，命令仍需要 sudo

如果即使在设置能力后（通过 systemd 环境能力或文件能力）`smartctl` 仍然失败，问题很可能在于**设备权限**。即使拥有 `CAP_SYS_RAWIO` 和 `CAP_SYS_ADMIN`，用户也需要对设备文件本身具有读取权限。

检查你的设备权限：

```bash
ls -l /dev/sda /dev/nvme0
```

你通常会看到类似这样的内容：

```
brw-rw---- root disk /dev/sda      # 块设备，组可读
crw------- root root /dev/nvme0    # 字符设备，仅 root 可读
```

#### 将用户添加到 disk 组 {#disk-group}

大多数 Linux 发行版都有一个 `disk` 组，可以提供对磁盘设备的访问。将 beszel 用户添加到此组：

```bash
sudo usermod -aG disk beszel
sudo systemctl restart beszel-agent
```

::: tip NVMe 设备的注意事项
某些系统将 NVMe 字符设备（`/dev/nvme0`）设置为模式 `600`（仅所有者），即使 SATA 设备在 `disk` 组下工作正常。如果在将用户添加到 `disk` 组后 NVMe S.M.A.R.T. 仍然无法工作，请参见下面的解决方案。
:::

#### 调整 NVMe 设备权限

如果在将用户添加到 `disk` 组后你的 NVMe 设备仍然无法访问，你可以调整设备组为 `disk`。

```bash
# 检查当前权限
ls -l /dev/nvme0

# 创建一个 udev 规则，将 NVMe 设备更改为 disk 组所有权
sudo tee /etc/udev/rules.d/99-smartctl-disk-group.rules > /dev/null << 'EOF'
# 将 NVMe 设备更改为 disk 组所有权以进行 S.M.A.R.T. 监控
KERNEL=="nvme[0-9]*", GROUP="disk", MODE="0660"
EOF

# 重新加载 udev 规则
sudo udevadm control --reload-rules
sudo udevadm trigger

# 验证新权限（应该显示 disk 组和 660 模式）
ls -l /dev/nvme0

# 重启代理
sudo systemctl restart beszel-agent
```

这会将组所有权更改为 `disk`，模式更改为 `0660`（组可读）。

::: warning 潜在冲突
如果系统上其他软件为相同设备创建了 udev 规则，可能会产生冲突。你可以使用以下命令检查现有规则：

```bash
grep -r "KERNEL.*nvme" /etc/udev/rules.d/
```

:::

要删除 udev 规则：

```bash
sudo rm /etc/udev/rules.d/99-smartctl-disk-group.rules
sudo udevadm control --reload-rules
sudo udevadm trigger
```
