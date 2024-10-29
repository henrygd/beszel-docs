# 安装 Hub

Beszel 支持通过 Docker 或使用二进制文件进行安装。

- [Docker](#docker)
- [二进制文件](#binary)
  - [快速脚本](#_1-quick-script)
  - [手动下载和启动](#_2-manual-download-and-startup)
  - [构建和启动](#_3-build-and-startup)

## Docker

这两种方法都会在端口 `8090` 上启动 Beszel 服务，并将 `./beszel_data` 目录挂载为持久存储。

::: code-group

```yaml [docker-compose.yml]
# Run with docker compose up -d
services:
  beszel:
    image: 'henrygd/beszel'
    container_name: 'beszel'
    restart: unless-stopped
    ports:
      - '8090:8090'
    volumes:
      - ./beszel_data:/beszel_data
```

```bash [docker run]
mkdir -p ./beszel_data && \
docker run -d \
  -v ./beszel_data:/beszel_data \
  -p 8090:8090 \
  henrygd/beszel
```

:::

## 二进制文件

有多种方法可以使用二进制文件进行安装。你可以选择以下你喜欢的方法。

### 1. 快速脚本

- `-u` : 卸载 Beszel Hub
- `-p <port>` : 指定端口号（默认：8090）

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-hub.sh -o install-hub.sh && chmod +x install-hub.sh && ./install-hub.sh
```

### 2. 手动下载和启动

<details>
  <summary>Click to expand/collapse</summary>

从 [releases](https://github.com/henrygd/beszel/releases) 下载与你的服务器 CPU 架构匹配的最新二进制文件并手动运行它。不过，你需要手动创建一个服务来保持它运行。

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel_$(uname -s)_$(uname -m | sed 's/x86_64/amd64/' | sed 's/armv7l/arm/' | sed 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel | tee ./beszel >/dev/null && chmod +x beszel
```

直接运行 Hub：

```bash
./beszel serve
```

</details>

### 3. 构建和启动

<details>
  <summary>Click to expand/collapse</summary>

Beszel 是用 Go 编写的，所以你可以轻松地自行构建它们，或者为不同的平台进行交叉编译。如果你还没有安装 Go，请先 [安装 Go](https://go.dev/doc/install)。

#### 1. Git 克隆并准备依赖项

```bash
git clone https://github.com/henrygd/beszel.git
cd beszel && go mod tidy
```

#### 2. 构建

Hub 会将 Web UI 嵌入到二进制文件中，所以你必须先构建网站。这个项目默认使用 [bun](https://bun.sh/)，但如果你喜欢，也可以使用 Node.js：

```bash
cd beszel/site
bun install
bun run build
```

然后在 `beszel/cmd/hub` 目录下：

```bash
cd beszel/cmd/hub
CGO_ENABLED=0 go build -ldflags "-w -s" .
```

:::tip
如果你需要在不同的平台上运行，可以使用 `GOOS` 和 `GOARCH` 环境变量进行交叉编译。

例如，要为 FreeBSD ARM64 构建：

```bash
GOOS=freebsd GOARCH=arm64 CGO_ENABLED=0 go build -ldflags "-w -s" .
```

你可以通过运行 `go tool dist list` 查看有效选项列表。
:::

#### 4. 直接运行 Hub

> 你需要手动创建一个服务来保持它运行。

```bash
./beszel serve
```

</details>