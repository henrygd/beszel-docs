# 代理安装

Beszel 代理支持通过 Docker / Podman 容器、单一二进制文件或 Home Assistant 插件进行安装。

::: tip 提示
如果您是首次设置 Beszel，请查看 [开始使用](./getting-started.md) 指南。
:::

## 要求

如果代理和中心 (hub) 位于不同的主机上，您可能需要在代理系统的防火墙上更新配置，以允许代理端口上的传入 TCP 连接。

或者，您可以使用 Wireguard 或 Cloudflare Tunnel 等软件（[说明](https://github.com/henrygd/beszel/discussions/250)）安全地绕过防火墙。

## 使用中心 (Hub)

在添加新系统时，中心 (hub) 的 Web UI 中提供了可供复制/粘贴的 `docker-compose.yml` 或二进制安装命令。

<a href="/image/add-system-2.png" target="_blank">
  <img src="/image/add-system-2.png" height="482" width="946" alt="添加系统对话框" />
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
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # 通过在 /extra-filesystems 中挂载文件夹来监控其他磁盘/分区
      # - /mnt/disk1/.beszel:/extra-filesystems/disk1:ro
    environment:
      PORT: 45876
      KEY: '<公钥>'
```

```bash [docker run]
docker run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<公钥>" \
  -e PORT=45876 \
  henrygd/beszel-agent:latest
```

```bash [podman run]
podman run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<公钥>" \
  -e PORT=45876 \
  docker.io/henrygd/beszel-agent:latest
```

### 为什么要使用主机网络模式？

代理必须使用主机网络模式才能访问网络接口指标，这将自动暴露端口。如果需要，可以使用环境变量更改端口。

如果您不需要网络统计信息，可以从 compose 文件中删除该行并手动映射端口。

:::

## 二进制文件

安装二进制文件有多种方法。请选择您喜欢的方式。

### 1. 快速脚本 (Linux)

::: tip 提示
在添加新系统时，可以从中心 (hub) 的 Web UI 复制预配置的命令，因此在大多数情况下，您不需要手动运行此命令。
:::

此命令下载并运行我们的 `install-agent.sh` 脚本。

该脚本将安装最新的二进制文件并创建一个 systemd 服务，以使其在重新启动后继续运行。您可以选择启用自动每日更新。

- `-p` : 端口
- `-k` : 公钥（用引号括起来）

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh -o  install-agent.sh && chmod +x install-agent.sh && ./install-agent.sh
```

### 2. 手动下载和启动

::: details 点击展开/收起

#### 下载二进制文件

从 [releases](https://github.com/henrygd/beszel/releases) 下载与您的服务器操作系统/架构匹配的最新二进制文件。

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed 's/x86_64/amd64/' | sed 's/armv7l/arm/' | sed 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel-agent | tee ./beszel-agent >/dev/null && chmod +x beszel-agent
```

#### 启动代理

- `PORT` : 端口
- `KEY` : 公钥（用引号括起来）

```bash
PORT=45876 KEY="<公钥>" ./beszel-agent
```

#### 更新代理

```bash
./beszel-agent update
```

#### 创建服务（可选）

如果您的系统使用 systemd，您可以创建一个服务以使中心在重新启动后继续运行。

1. 在 `/etc/systemd/system/beszel-agent.service` 中创建一个服务文件。

```ini
[Unit]
Description=Beszel Agent Service
After=network.target

[Service]
Environment="PORT=$PORT"
Environment="KEY=$KEY"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=always
RestartSec=5
ExecStart={/path/to/working/directory}/beszel-agent

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

### 3. 手动编译和启动

:::: details 点击展开/收起

#### 编译

请参阅 [编译](./compiling.md) 了解有关如何自己编译中心的更多信息。

#### 启动代理

- `PORT` : 端口
- `KEY` : 公钥（用引号括起来）

```bash
PORT=45876 KEY="<公钥>" ./beszel-agent
```

#### 更新代理

```bash
./beszel-agent update
```

#### 创建服务（可选）

如果您的系统使用 systemd，您可以创建一个服务以使中心在重新启动后继续运行。

1. 在 `/etc/systemd/system/beszel-agent.service` 中创建一个服务文件。

```ini
[Unit]
Description=Beszel Agent Service
After=network.target

[Service]
Environment="PORT=$PORT"
Environment="KEY=$KEY"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=always
RestartSec=5
ExecStart={/path/to/working/directory}/beszel-agent

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

## Home Assistant

请参阅 [Home Assistant 代理页面](./home-assistant.md) 获取将代理设置为 Home Assistant 插件的说明。
