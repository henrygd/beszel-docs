# Agent Installation

Beszel Agent supports installation via Docker / Podman container, single binary file, or Home Assistant add-on.

::: tip
Check the [Getting Started](./getting-started.md) guide if you're setting up Beszel for the first time.
:::

## Requirements

If the agent and hub are on different hosts, you may need to update the firewall on your agent system to allow incoming TCP connections on the agent's port.

Alternatively, you can use software like Wireguard or Cloudflare Tunnel ([instructions](https://github.com/henrygd/beszel/discussions/250)) to securely bypass the firewall.

## Using the Hub

The `docker-compose.yml` or binary install command is provided for copy/paste in the hub's web UI when adding a new system.

<a href="/image/add-system-2.png" target="_blank">
  <img src="/image/add-system-2.png" height="482" width="946" alt="Add system dialog" />
</a>

## Docker or Podman

::: tip
Preconfigured `docker-compose.yml` content can be copied the hub's web UI when adding a new system, so in most cases you do not need to set this up manually.
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
      # monitor other disks / partitions by mounting a folder in /extra-filesystems
      # - /mnt/disk1/.beszel:/extra-filesystems/disk1:ro
    environment:
      PORT: 45876
      KEY: '<public key>'
```

```bash [docker run]
docker run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<public key>" \
  -e PORT=45876 \
  henrygd/beszel-agent:latest
```

```bash [podman run]
podman run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<public key>" \
  -e PORT=45876 \
  docker.io/henrygd/beszel-agent:latest
```

### Why host network mode?

The agent must use host network mode to access the host's network interface stats. This automatically exposes the port, so change the port using an environment variable if needed.

If you don't need host network stats, you can remove that line from the compose file and map the port manually.

When connecting to a local agent, `localhost` will not work because the containers are in different networks. You can try using the LAN IP instead, or use `host.docker.internal` (Docker) or `host.containers.internal` (Podman). There is an example in the [Getting Started](./getting-started.md) guide.

:::

## Binary

There are multiple ways to install the binary. Choose your preference below.

### 1. Quick script (Linux)

::: tip
A preconfigured command can be copied in the hub's web UI when adding a new system, so in most cases you do not need to run this command manually.
:::

::: warning Root privileges required
The script needs root privileges to create a `beszel` user and set up a service to keep the agent running after reboot. The agent process itself **does not run as root**.
:::

The script installs the latest binary and optionally enables automatic daily updates.

- `-p`: Port (default: 45876)
- `-k`: Public key (enclose in quotes; interactive if not provided)
- `-u`: Uninstall
- `--china-mirrors`: Use GitHub mirror to resolve network issues in mainland China

```bash
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh -o  /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && /tmp/install-agent.sh
```

### 2. Manual download and start

::: details Click to expand/collapse

#### Download the binary

Download the latest binary from [releases](https://github.com/henrygd/beszel/releases) that matches your server's OS / architecture.

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed -e 's/x86_64/amd64/' -e 's/armv6l/arm/' -e 's/armv7l/arm/' -e 's/aarch64/arm64/').tar.gz" | tar -xz -O beszel-agent | tee ./beszel-agent >/dev/null && chmod +x beszel-agent
```

#### Start the agent

- `PORT` : Port
- `KEY` : Public Key

```bash
PORT=45876 KEY="<public key>" ./beszel-agent
```

#### Update the agent

```bash
./beszel-agent update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the agent running after reboot.

1. Create a service file in `/etc/systemd/system/beszel-agent.service`.

```ini
[Unit]
Description=Beszel Agent Service
After=network-online.target
Wants=network-online.target

[Service]
ExecStart={/path/to/working/directory}/beszel-agent
Environment="PORT=$PORT"
Environment="KEY=$KEY"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=on-failure
RestartSec=5
StateDirectory=beszel-agent

# Security/sandboxing settings
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
SystemCallArchitectures=native

[Install]
WantedBy=multi-user.target
```

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

:::

### 3. Manual compile and start

:::: details Click to expand/collapse

#### Compile

See [Compiling](./compiling.md) for information on how to compile the agent yourself.

#### Start the agent

- `PORT` : Port
- `KEY` : Public Key

```bash
PORT=45876 KEY="<public key>" ./beszel-agent
```

#### Update the agent

```bash
./beszel-agent update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the agent running after reboot.

1. Create a service file in `/etc/systemd/system/beszel-agent.service`.

```ini
[Unit]
Description=Beszel Agent Service
After=network-online.target
Wants=network-online.target

[Service]
ExecStart={/path/to/working/directory}/beszel-agent
Environment="PORT=$PORT"
Environment="KEY=$KEY"
# Environment="EXTRA_FILESYSTEMS=sdb"
Restart=on-failure
RestartSec=5
StateDirectory=beszel-agent

# Security/sandboxing settings
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
SystemCallArchitectures=native

[Install]
WantedBy=multi-user.target
```

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

::::

## Home Assistant

See the [Home Assistant Agent page](./home-assistant.md) for instructions on setting up the agent as a Home Assistant add-on.
