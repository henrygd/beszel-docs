<script setup>
  import pkg from '../../package.json'
</script>

# 编译

Beszel 中心 (hub) 和代理都使用 Go 语言编写，因此您可以轻松地自己构建它们，或者为不同的平台进行交叉编译。 如果您还没有安装 Go 语言，请先 [安装 Go](https://go.dev/doc/install)。

## 克隆代码库

```bash-vue
# 克隆代码库
git clone --branch v{{pkg.version}} --depth 1 https://github.com/henrygd/beszel.git
# 导航到项目目录
cd beszel/beszel
```

以下命令假设您位于项目目录 (`/beszel`) 中。

## 使用 Makefile

运行 `make` 命令。这将在 `build` 目录中创建包含二进制文件的目录。

```bash
# 构建中心和代理（同时）
make
# 只构建代理
make build-agent
# 只构建中心（需要 Node 或 Bun）
make build-hub
```

您还可以为不同的平台进行构建：

```bash
make OS=freebsd ARCH=arm64
```

运行 `go tool dist list` 命令查看有效的选项列表。

## 手动编译

### 准备依赖项

```bash
go mod tidy
```

### 代理

进入 `beszel/cmd/agent` 目录并运行以下命令可在当前目录中创建二进制文件：

```bash
go build -ldflags "-w -s" .
```

### 中心

中心会将 Web UI 嵌入到二进制文件中，因此您必须首先构建网站。我使用的是 [Bun](https://bun.sh/)，但如果您愿意也可以使用 Node.js：

```bash
cd site
bun install
bun run build
```

然后在 `/beszel/cmd/hub` 中：

```bash
go build -ldflags "-w -s" .
```

### 交叉编译

您可以使用 `GOOS` 和 `GOARCH` 环境变量为不同的平台进行交叉编译。

例如，要为 FreeBSD ARM64 构建：

```bash
GOOS=freebsd GOARCH=arm64 go build -ldflags "-w -s" .
```

运行 `go tool dist list` 命令查看有效的选项列表。
