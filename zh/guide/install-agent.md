# 安装 Agent

Beszel Agent 同样支持通过 Docker 或使用二进制文件进行安装。

- [Docker](#docker)
- [二进制文件](#binary)
  - [快速脚本](#_1-quick-script)
  - [手动下载和启动](#_2-manual-download-and-startup)
  - [构建和启动](#_3-build-and-startup)

## 要求

服务器需要开放一个端口供 Hub 连接，因此不适用于位于私有网络中的服务器（且不在与 Hub 相同的私有网络中）。

## Hub

在 Web 面板上，提供了一个安装命令供复制。你可以选择直接复制命令进行安装，或者参考本文档继续手动安装。

<div style="display: flex;">
    <img src="/image/agent-1.webp" width="50%" />
    <img src="/image/agent-2.webp" width="50%" />
</div>

## Docker

- `PROT` : 端口
- `KEY` : 公钥

```yaml
services:
  beszel-agent:
    image: "henrygd/beszel-agent"
    container_name: "beszel-agent"
    restart: unless-stopped
    network_mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # monitor other disks / partitions by mounting a folder in /extra-filesystems
      # - /mnt/disk1/.beszel:/extra-filesystems/disk1:ro
    environment:
      PORT: <port>
      KEY: "<public key>"
      # FILESYSTEM: /dev/sda1 # override the root partition / device for disk I/O stats
```

## 二进制文件

有多种方法可以使用二进制文件进行安装。你可以选择以下你喜欢的方法。

### 1. 快速脚本

- `-p` : 端口
- `-k` : 公钥

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh -o  install-agent.sh && chmod +x install-agent.sh && ./install-agent.sh -p <port> -k "<public key>"
```

### 2. 手动下载和启动

<details>
  <summary>Click to expand/collapse</summary>

从 [releases](https://github.com/henrygd/beszel/releases) 下载与你的服务器 CPU 架构匹配的最新二进制文件并手动运行它。不过，你需要手动创建一个服务来保持它运行。

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed 's/x86_64/amd64/' | sed 's/armv7l/arm/' | sed 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel-agent | tee ./beszel-agent >/dev/null && chmod +x beszel-agent
```

直接运行 Agent：

- `PROT` : 端口
- `KEY` : 公钥

```bash
PORT=<port> KEY="<public key>" ./beszel-agent
```

</details>

### 3. 编译和启动

<details>
  <summary>Click to expand/collapse</summary>

Beszel 是用 Go 编写的，所以你可以轻松地自行构建它们，或者为不同的平台进行交叉编译。如果你还没有安装 Go，请先 [安装 Go](https://go.dev/doc/install)。

#### 1. Git 克隆并准备依赖项

```bash
git clone https://github.com/henrygd/beszel.git
cd beszel && go mod tidy
```

### 4. 构建

```bash
cd beszel/cmd/agent
CGO_ENABLED=0 go build -ldflags "-w -s" .
```

:::tip
果你需要在不同的平台上运行，可以使用 `GOOS` 和 `GOARCH` 环境变量进行交叉编译。

例如，要为 FreeBSD ARM64 构建：

```bash
GOOS=freebsd GOARCH=arm64 CGO_ENABLED=0 go build -ldflags "-w -s" .
```

你可以通过运行 `go tool dist list` 查看有效选项列表。
:::

#### 4. 直接运行 Agent

> 你需要手动创建一个服务来保持它运行。

- `PROT` : 端口
- `KEY` : 公钥

```bash
PORT=<port> KEY="<public key>" ./beszel-agent
```

</details>