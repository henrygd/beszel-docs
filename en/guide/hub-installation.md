# Hub Installation

Beszel supports installation via Docker/ Podman or single binary file.

::: tip
Check the [Getting Started](./getting-started.md) guide if you're setting up Beszel for the first time.
:::

## Docker or Podman

All methods will start the Beszel service on port `8090` and mount the `./beszel_data` directory for persistent storage.

::: code-group

```yaml [docker-compose.yml]
services:
  beszel:
    image: henrygd/beszel
    container_name: beszel
    restart: unless-stopped
    ports:
      - 8090:8090
    volumes:
      - ./beszel_data:/beszel_data
```

```bash [docker run]
mkdir -p ./beszel_data && \
docker run -d \
  --name beszel \
  --restart=unless-stopped \
  -v ./beszel_data:/beszel_data \
  -p 8090:8090 \
  henrygd/beszel
```

```bash [podman run]
mkdir -p ./beszel_data && \
podman run -d \
  --name beszel \
  --restart=unless-stopped \
  -v ./beszel_data:/beszel_data \
  -p 8090:8090 \
  docker.io/henrygd/beszel
```

:::

<!--@include: ./parts/hub-docker-instructions.md-->

## Binary

There are multiple ways to install the binary. Choose your preference below.

### 1. Quick script (Linux)

This command downloads and runs our `install-hub.sh` script. The script installs the latest binary and creates a systemd service to keep it running after reboot.

- `-u` : Uninstall
- `-p <port>` : Specify a port number (default: 8090)

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-hub.sh -o install-hub.sh && chmod +x install-hub.sh && ./install-hub.sh
```

### 2. Manual download and start

::: details Click to expand/collapse

#### Download

Download the latest binary from [releases](https://github.com/henrygd/beszel/releases) that matches your server's CPU architecture and run it manually. You will need to create a service manually to keep it running after reboot.

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel_$(uname -s)_$(uname -m | sed -e 's/x86_64/amd64/' -e 's/armv6l/arm/' -e 's/armv7l/arm/' -e 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel | tee ./beszel >/dev/null && chmod +x beszel
```

#### Start the hub

```bash
./beszel serve --http "0.0.0.0:8090"
```

#### Update the hub

```bash
./beszel update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the hub running after reboot.

1. Create a service file in `/etc/systemd/system/beszel.service`. A non-root user can be used if the user has write access to the working directory.

```ini
[Unit]
Description=Beszel Hub
After=network.target

[Service]
Type=simple
Restart=always
RestartSec=3
User=root
WorkingDirectory={/path/to/working/directory}
ExecStart={/path/to/working/directory}/beszel serve --http "0.0.0.0:8090"

[Install]
WantedBy=multi-user.target
```

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel.service
sudo systemctl start beszel.service
```

:::

### 3. Manual compile and start

::: details Click to expand/collapse

#### Compile

See [Compiling](./compiling.md) for information on how to compile the hub yourself.

#### Start the hub

```bash
./beszel serve --http "0.0.0.0:8090"
```

#### Update the hub

```bash
./beszel update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the hub running after reboot.

1. Create a service file in `/etc/systemd/system/beszel.service`. A non-root user can be used if the user has write access to the working directory.

```ini
[Unit]
Description=Beszel Hub
After=network.target

[Service]
Type=simple
Restart=always
RestartSec=5
User=root
WorkingDirectory={/path/to/working/directory}
ExecStart={/path/to/working/directory}/beszel serve --http "0.0.0.0:8090"

[Install]
WantedBy=multi-user.target
```

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel.service
sudo systemctl start beszel.service
```

:::
