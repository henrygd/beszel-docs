# 代理安装

代理可通过 Docker / Podman、单一二进制文件、Homebrew 包、WinGet / Scoop 包或 Home Assistant 插件进行安装。

::: tip 提示
如果您是首次设置 Beszel，请查看 [开始使用](./getting-started.md) 指南。
:::

## 必需变量

- `KEY`：在 Hub 中添加系统时显示的公钥。
- `TOKEN`：用于验证代理（参见 `/settings/tokens`）。
- `HUB_URL`：用于出站 WebSocket 连接（SSH 连接不需要）。

> 更多信息请参阅 [安全](./security.md) 和 [环境变量](./environment-variables.md) 页面。

## 使用中心 (Hub)

在中心 (hub) 的 Web UI 中提供了可供复制/粘贴的 `docker-compose.yml` 或二进制安装命令。

点击 **添加系统** 按钮手动配置代理，或使用通用令牌（`/settings/tokens`）连接代理，无需提前设置。

<a href="/image/add-system-install.png" target="_blank">
  <img src="/image/add-system-install.png" height="580" width="1043" alt="Add system dialog" />
</a>

## Docker 或 Podman

::: tip 提示
在添加新系统时，可以从中心 (hub) 的 Web UI 复制预配置的 `docker-compose.yml` 内容，因此在大多数情况下，您不需要手动进行设置。
:::

::: code-group

```yaml [docker-compose.yml]
services:
  beszel-agent:
    image: henrygd/beszel-agent
    container_name: beszel-agent
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./beszel_agent_data:/var/lib/beszel-agent
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # 通过在 /extra-filesystems 中挂载文件夹来监控其他磁盘/分区
      # - /mnt/disk1/.beszel:/extra-filesystems/disk1:ro
    environment:
      LISTEN: 45876
      KEY: "<公钥>"
      HUB_URL: "<Hub 地址>"
      TOKEN: "<令牌>"
```

```bash [docker run]
docker run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<公钥>" \
  -e HUB_URL="<Hub 地址>" \
  -e TOKEN="<令牌>" \
  -e LISTEN=45876 \
  henrygd/beszel-agent:latest
```

```bash [podman run]
# 如果不同，请将 1000 替换为您的实际用户 ID。
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /run/user/1000/podman/podman.sock:/run/user/1000/podman/podman.sock:ro \
  -e KEY="<公钥>" \
  -e HUB_URL="<Hub 地址>" \
  -e TOKEN="<令牌>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

:::

### 为什么使用主机网络模式？

代理必须使用主机网络模式才能访问主机的网络接口统计数据。这会自动暴露端口，因此如果需要，请使用环境变量更改端口。

如果您不需要主机网络统计数据，可以从 compose 文件中删除该行并手动映射端口。

### 连接到本地代理

连接到本地代理时，`localhost` 将不起作用，因为容器位于不同的网络中。推荐的连接方式是使用 Unix 套接字。

<!-- @include: ./parts/hub-docker-instructions.md -->

:::

## 二进制文件

Beszel 使用纯 Go 编写，如果没有预构建的二进制文件，可以很容易地进行编译（或交叉编译）。

### 1. 安装脚本 (Linux, FreeBSD)

::: warning 需要 root 权限
该脚本需要 root 权限来创建 `beszel` 用户，并设置服务以确保代理在重启后继续运行。代理进程本身不以 root 身份运行。
:::

该脚本会安装最新的二进制文件，并可选地启用每日自动更新。

- `-k`：公钥（用引号括起来；如果未提供则进入交互模式）
- `-p`：端口或地址（默认：45876）
- `-t`：令牌（可选，用于向后兼容）
- `-url`：中心 URL（可选，用于向后兼容）
- `-v`：版本（默认：latest）
- `-u`：卸载
- `--auto-update`：启用或禁用每日自动更新（如果未提供则进入交互模式）
- `--china-mirrors`：使用 GitHub 镜像以解决中国大陆的网络问题
- `-h`：显示帮助信息

```bash
curl -sL https://get.beszel.dev -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && /tmp/install-agent.sh
```

### 2. 手动下载和启动 (Linux, FreeBSD, 其他)

::: details 点击展开/收起

#### 下载二进制文件

从 [releases](https://github.com/henrygd/beszel/releases) 下载与您的服务器操作系统/架构匹配的最新二进制文件。

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed -e 's/x86_64/amd64/' -e 's/armv6l/arm/' -e 's/armv7l/arm/' -e 's/aarch64/arm64/').tar.gz" | tar -xz beszel-agent
```

#### 启动代理

使用 `-h` 查看所有可用选项。

```bash
./beszel-agent -key "<public key>" -token "<token>" -url "<hub url>"
```

#### 更新代理

```bash
./beszel-agent update
```

#### 创建服务（可选）

如果您的系统使用 systemd，您可以创建一个服务以使中心在重新启动后继续运行。

1. 在 `/etc/systemd/system/beszel-agent.service` 中创建一个服务文件。将占位符值（例如 `<path-to-binary>`、`<public key>`）替换为您的实际配置。您还可以使用 `KEY_FILE` 和 `TOKEN_FILE` 从受保护的文件中加载机密（参见 [issue #1627](https://github.com/henrygd/beszel/issues/1627)）。

```ini
[Unit]
Description=Beszel Agent Service
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=<path-to-binary>/beszel-agent
Environment="LISTEN=45876"
Environment="KEY=<public key>"
Environment="TOKEN=<token>"
Environment="HUB_URL=<hub url>"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=on-failure
RestartSec=5
StateDirectory=beszel-agent

# 安全/沙盒设置
KeyringMode=private
LockPersonality=yes
NoNewPrivileges=yes
PrivateTmp=yes
ProtectClock=yes
ProtectHome=read-only
ProtectHostname=yes
ProtectKernelLogs=yes
ProtectSystem=strict
RemoveIPC=yes
RestrictSUIDSGID=true

[Install]
WantedBy=multi-user.target
```

2. 启用并启动服务。

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

:::

### 3. 手动编译和启动 (任何平台)

:::: details 点击展开/收起

#### 编译

请参阅 [编译](./compiling.md) 了解有关如何自己编译中心的更多信息。

#### 启动代理

使用 `-h` 查看所有可用选项。

```bash
./beszel-agent -key "<public key>" -token "<token>" -url "<hub url>"
```

#### 更新代理

```bash
./beszel-agent update
```

#### 创建服务（可选）

如果您的系统使用 systemd，您可以创建一个服务以使中心在重新启动后继续运行。

1. 在 `/etc/systemd/system/beszel-agent.service` 中创建一个服务文件。将占位符值（例如 `<path-to-binary>`、`<public key>`）替换为您的实际配置。您还可以使用 `KEY_FILE` 和 `TOKEN_FILE` 从受保护的文件中加载机密（参见 [issue #1627](https://github.com/henrygd/beszel/issues/1627)）。

```ini
[Unit]
Description=Beszel Agent Service
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=<path-to-binary>/beszel-agent
Environment="LISTEN=45876"
Environment="KEY=<public key>"
Environment="TOKEN=<token>"
Environment="HUB_URL=<hub url>"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=on-failure
RestartSec=5
StateDirectory=beszel-agent

# 安全/沙盒设置
KeyringMode=private
LockPersonality=yes
NoNewPrivileges=yes
ProtectClock=yes
ProtectHome=read-only
ProtectHostname=yes
ProtectKernelLogs=yes
ProtectSystem=strict
RemoveIPC=yes
RestrictSUIDSGID=true

[Install]
WantedBy=multi-user.target
```

2. 启用并启动服务。

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

::::

## Homebrew (macOS, Linux)

环境变量可以在 `~/.config/beszel/beszel-agent.env` 中更改。

日志写入到 `~/.cache/beszel/beszel-agent.log`。

### Homebrew 安装脚本

- `-k`：SSH 密钥（如果未提供则进入交互模式）
- `-p`：端口（默认：45876）
- `-t`：令牌（可选，用于向后兼容）
- `-url`：中心 URL（可选，用于向后兼容）
- `-h`：显示帮助信息

```bash
curl -sL https://get.beszel.dev/brew -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && /tmp/install-agent.sh
```

### Homebrew 手动安装

```bash
mkdir -p ~/.config/beszel ~/.cache/beszel
echo 'KEY="ssh-ed25519 AAAA..."' > ~/.config/beszel/beszel-agent.env
brew tap henrygd/beszel
brew install beszel-agent
brew services start beszel-agent
```

## WinGet / Scoop (Windows)

代理可作为 [WinGet](https://winstall.app/apps/henrygd.beszel-agent) 和 [Scoop](https://scoop.sh/) 包使用。

下面的脚本会在您已安装的情况下使用 Scoop，否则如果已安装 WinGet 则使用 WinGet。如果两者都不可用，它将同时安装 Scoop 和代理。

它还将安装 [NSSM](https://nssm.cc/usage) 并创建一个服务，以便在重启后继续运行代理。

- `-Key`：SSH 密钥（如果未提供则进入交互模式）
- `-Port`：端口（默认：45876）
- `-Url`：中心 URL
- `-Token`：令牌
- `-ConfigureFirewall`：添加防火墙规则

```powershell
& iwr -useb https://get.beszel.dev -OutFile "$env:TEMP\install-agent.ps1"; & Powershell -ExecutionPolicy Bypass -File "$env:TEMP\install-agent.ps1"
```

> 脚本的源代码可在 [GitHub](https://github.com/henrygd/beszel/blob/main/supplemental/scripts/install-agent.ps1) 上获取。

还有社区开发的 GUI 应用程序用于安装和管理代理：

- [vmhomelab/beszel-agent-installer](https://github.com/vmhomelab/beszel-agent-installer)，使用 [Chocolatey](https://chocolatey.org/)。
- [MiranoVerhoef/BeszelAgentManager](https://github.com/MiranoVerhoef/BeszelAgentManager)，使用 WinGet。

### 编辑配置

通过运行以下命令在 NSSM 中编辑服务。在 GUI 中向右滚动以查找环境变量。

```powershell
nssm edit beszel-agent
```

您也可以直接从命令行更改选项：

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:"
```

完成后重启服务：`nssm restart beszel-agent`

### 日志

日志应写入 `C:\ProgramData\beszel-agent\logs`。

### 升级

#### Scoop

```powershell
nssm stop beszel-agent; & scoop update beszel-agent; & nssm start beszel-agent
```

#### WinGet

请参阅 [使用 WinGet 升级](./upgrade-winget.md)。

### 卸载

#### Scoop

```powershell
nssm stop beszel-agent
nssm remove beszel-agent confirm
scoop uninstall beszel-agent
```

#### WinGet

```powershell
nssm stop beszel-agent
nssm remove beszel-agent confirm
winget uninstall henrygd.beszel-agent
```

## Home Assistant

请参阅 [Home Assistant 代理页面](./home-assistant.md) 获取将代理设置为 Home Assistant 插件的说明。
