# Install Hub

Beszel supports installation via Docker or using binaries.

- [Docker](#docker)
- [Binary](#binary)
  - [Quick script](#_1-quick-script)
  - [Manual download and startup](#_2-manual-download-and-startup)
  - [Build and Startup](#_3-build-and-startup)

## Docker

Both methods will start the Beszel service on port `8090` and mount the `./beszel_data` directory for persistent storage.

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

## Binary

There are multiple ways to install using binary files. You can choose one of the methods below that you prefer.

### 1. Quick script

- `-u` : Uninstall the Beszel Hub
- `-p <port>` : Specify a port number (default: 8090)

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-hub.sh -o install-hub.sh && chmod +x install-hub.sh && ./install-hub.sh
```

### 2. Manual Download and Startup

<details>
  <summary>Click to expand/collapse</summary>

Download the latest binary from [releases](https://github.com/henrygd/beszel/releases) that matches your server's CPU architecture and run it manually. However, you will need to create a service manually to keep it running.

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel_$(uname -s)_$(uname -m | sed 's/x86_64/amd64/' | sed 's/armv7l/arm/' | sed 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel | tee ./beszel >/dev/null && chmod +x beszel
```

Running the hub directly:

```bash
./beszel serve
```

</details>

### 3. Build and Startup

<details>
  <summary>Click to expand/collapse</summary>

Beszel are written in Go, so you can easily build them yourself, or cross-compile for different platforms. Please [install Go](https://go.dev/doc/install) first if you haven't already.

#### 1. Git clone & Prepare dependencies

```bash
git clone https://github.com/henrygd/beszel.git
cd beszel && go mod tidy
```

#### 2. Build

The hub embeds the web UI in the binary, so you must build the website first. This project uses [bun](https://bun.sh/) by default, but you may use Node.js if you prefer:

```bash
cd beszel/site
bun install
bun run build
```

Then in `beszel/cmd/hub`:

```bash
cd beszel/cmd/hub
CGO_ENABLED=0 go build -ldflags "-w -s" .
```

:::tip
If you need to run on different platforms, you can cross-compile using the `GOOS` and `GOARCH` environment variables.

For example, to build for FreeBSD ARM64:

```bash
GOOS=freebsd GOARCH=arm64 CGO_ENABLED=0 go build -ldflags "-w -s" .
```

You can see a list of valid options by running `go tool dist list`.
:::

#### 4. Running the hub directly

> You will need to create a service manually to keep it running.

```bash
./beszel serve
```

</details>