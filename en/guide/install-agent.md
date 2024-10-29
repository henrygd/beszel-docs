# Install Agent

Beszel Agent also supports installation via Docker or using binaries.

- [Docker](#docker)
- [Binary](#binary)
  - [Quick script](#_1-quick-script)
  - [Manual download and startup](#_2-manual-download-and-startup)
  - [Build and Startup](#_3-build-and-startup)

## Requirements

The server needs to open a port for the Hub to connect, so it is not suitable for servers in a private network (and not in the same private network as the Hub).

## Hub

On the web panel, an installation command is provided for copying. You can choose to copy the command directly for installation or refer to this document to continue with manual installation.

<div style="display: flex;">
    <img src="/image/agent-1.webp" width="50%" />
    <img src="/image/agent-2.webp" width="50%" />
</div>

## Docker

- `PROT` : Port
- `KEY` : Public Key

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

## Binary

There are multiple ways to install using binary files. You can choose one of the methods below that you prefer.

### 1. Quick script

- `-p` : Port
- `-k` : Public Key

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh -o  install-agent.sh && chmod +x install-agent.sh && ./install-agent.sh -p <port> -k "<public key>"
```

### 2. Manual Download and Startup

<details>
  <summary>Click to expand/collapse</summary>

Download the latest binary from [releases](https://github.com/henrygd/beszel/releases) that matches your server's CPU architecture and run it manually. However, you will need to create a service manually to keep it running.

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed 's/x86_64/amd64/' | sed 's/armv7l/arm/' | sed 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel-agent | tee ./beszel-agent >/dev/null && chmod +x beszel-agent
```

Running the agent directly:

- `PROT` : Port
- `KEY` : Public Key

```bash
PORT=<port> KEY="<public key>" ./beszel-agent
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

### 4. Build

```bash
cd beszel/cmd/agent
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

#### 4. Running the agent directly

> You will need to create a service manually to keep it running.

- `PROT` : Port
- `KEY` : Public Key

```bash
PORT=<port> KEY="<public key>" ./beszel-agent
```

</details>