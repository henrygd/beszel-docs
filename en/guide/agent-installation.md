# Agent Installation

The agent can be installed via Docker / Podman, single binary file, Homebrew package, WinGet / Scoop package, or Home Assistant add-on.

::: tip
Check the [Getting Started](./getting-started.md) guide if you're setting up Beszel for the first time.
:::

## Required variables

- `KEY`: The public key shown when adding a system in the Hub.
- `TOKEN`: Used to authenticate the agent (see `/settings/tokens`).
- `HUB_URL`: Used for outgoing WebSocket connection (not required for SSH connection).

> More information is available on the [Security](./security.md) and [Environment Variables](./environment-variables.md) pages.

## Using the Hub

The `docker-compose.yml` or binary install command is provided for copy/paste in the hub's web UI.

Click the **Add System** button to manually configure the agent, or use a universal token (`/settings/tokens`) to connect the agent without needing to set it up ahead of time.

<a href="/image/add-system-install.png" target="_blank">
  <img src="/image/add-system-install.png" height="580" width="1043" alt="Add system dialog" />
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
      - ./beszel_agent_data:/var/lib/beszel-agent
      - /var/run/docker.sock:/var/run/docker.sock:ro
      # monitor other disks / partitions by mounting a folder in /extra-filesystems
      # - /mnt/disk1/.beszel:/extra-filesystems/disk1:ro
    environment:
      LISTEN: 45876
      KEY: "<public key>"
      HUB_URL: "<hub url>"
      TOKEN: "<token>"
```

```bash [docker run]
docker run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<public key>" \
  -e HUB_URL="<hub url>" \
  -e TOKEN="<token>" \
  -e LISTEN=45876 \
  henrygd/beszel-agent:latest
```

```bash [podman run]
# Replace 1000 with your actual user ID if different.
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /run/user/1000/podman/podman.sock:/run/user/1000/podman/podman.sock:ro \
  -e KEY="<public key>" \
  -e HUB_URL="<hub url>" \
  -e TOKEN="<token>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

:::

### Why host network mode?

The agent must use host network mode to access the host's network interface stats. This automatically exposes the port, so change the port using an environment variable if needed.

If you don't need host network stats, you can remove that line from the compose file and map the port manually.

### Connecting to a local agent

When connecting to a local agent, `localhost` will not work because the containers are in different networks. The recommended way to connect them is to use a unix socket.

<!-- @include: ./parts/hub-docker-instructions.md -->

## Binary

Beszel is written in pure Go and can be easily compiled (or cross-compiled) if a prebuilt binary isn't available.

### 1. Install script (Linux, FreeBSD)

::: warning Root privileges required
The script needs root privileges to create a `beszel` user and set up a service to keep the agent running after reboot. The agent process itself does not run as root.
:::

The script installs the latest binary and optionally enables automatic daily updates.

- `-k`: Public key (enclose in quotes; interactive if not provided)
- `-p`: Port or address (default: 45876)
- `-t`: Token (optional for backwards compatibility)
- `-url`: Hub URL (optional for backwards compatibility)
- `-v`: Version (default: latest)
- `-u`: Uninstall
- `--auto-update`: Enable or disable automatic daily updates (interactive if not provided)
- `--china-mirrors`: Use GitHub mirror to resolve network issues in mainland China
- `-h`: Show help

```bash
curl -sL https://get.beszel.dev -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && /tmp/install-agent.sh
```

### 2. Manual download and start (Linux, FreeBSD, others)

::: details Click to expand/collapse

#### Download the binary

Download the latest binary from [releases](https://github.com/henrygd/beszel/releases) that matches your server's OS / architecture.

```bash
curl -sL "https://github.com/henrygd/beszel/releases/latest/download/beszel-agent_$(uname -s)_$(uname -m | sed -e 's/x86_64/amd64/' -e 's/armv6l/arm/' -e 's/armv7l/arm/' -e 's/aarch64/arm64/').tar.gz" | tar -xz beszel-agent
```

#### Start the agent

Use `-h` to see all available options.

```bash
./beszel-agent -key "<public key>" -token "<token>" -url "<hub url>"
```

#### Update the agent

```bash
./beszel-agent update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the agent running after reboot.

1. Create a service file in `/etc/systemd/system/beszel-agent.service`. Replace the placeholder values (e.g., `<path-to-binary>`, `<public key>`) with your actual configuration. You can also use `KEY_FILE` and `TOKEN_FILE` to load secrets from protected files (see [issue #1627](https://github.com/henrygd/beszel/issues/1627)).

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

# Security/sandboxing settings
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

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

:::

### 3. Manual compile and start (any platform)

:::: details Click to expand/collapse

#### Compile

See [Compiling](./compiling.md) for information on how to compile the agent yourself.

#### Start the agent

Use `-h` to see all available options.

```bash
./beszel-agent -key "<public key>" -token "<token>" -url "<hub url>"
```

#### Update the agent

```bash
./beszel-agent update
```

#### Create a service (optional)

If your system uses systemd, you can create a service to keep the agent running after reboot.

1. Create a service file in `/etc/systemd/system/beszel-agent.service`. Replace the placeholder values (e.g., `<path-to-binary>`, `<public key>`) with your actual configuration. You can also use `KEY_FILE` and `TOKEN_FILE` to load secrets from protected files (see [issue #1627](https://github.com/henrygd/beszel/issues/1627)).

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

# Security/sandboxing settings
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

2. Enable and start the service.

```bash
sudo systemctl daemon-reload
sudo systemctl enable beszel-agent.service
sudo systemctl start beszel-agent.service
```

::::

## Homebrew (macOS, Linux)

Environment variables can be changed in `~/.config/beszel/beszel-agent.env`.

Logs are written to `~/.cache/beszel/beszel-agent.log`.

### Homebrew install script

- `-k`: SSH key (interactive if not provided)
- `-p`: Port (default: 45876)
- `-t`: Token (optional for backwards compatibility)
- `-url`: Hub URL (optional for backwards compatibility)
- `-h`: Show help

```bash
curl -sL https://get.beszel.dev/brew -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && /tmp/install-agent.sh
```

### Homebrew manual install

```bash
mkdir -p ~/.config/beszel ~/.cache/beszel
echo 'KEY="ssh-ed25519 AAAA..."' > ~/.config/beszel/beszel-agent.env
brew tap henrygd/beszel
brew install beszel-agent
brew services start beszel-agent
```

## WinGet / Scoop (Windows) {#windows}

The agent is available as a package in [WinGet](https://winstall.app/apps/henrygd.beszel-agent) and [Scoop](https://scoop.sh/).

The script below uses Scoop if you have it installed, otherwise it uses WinGet if that's installed. If neither are available, it will install both Scoop and the agent.

It also installs [NSSM](https://nssm.cc/usage) and creates a service to keep the agent running after reboot.

- `-Key`: SSH key (interactive if not provided)
- `-Port`: Port (default: 45876)
- `-Url`: Hub URL
- `-Token`: Token
- `-ConfigureFirewall`: Add an incoming firewall rule.

```powershell
& iwr -useb https://get.beszel.dev -OutFile "$env:TEMP\install-agent.ps1"; & Powershell -ExecutionPolicy Bypass -File "$env:TEMP\install-agent.ps1"
```

> The script's source code is available [on GitHub](https://github.com/henrygd/beszel/blob/main/supplemental/scripts/install-agent.ps1).

There are also community-developed GUI applications to install and manage the agent:

- [vmhomelab/beszel-agent-installer](https://github.com/vmhomelab/beszel-agent-installer) which uses [Chocolatey](https://chocolatey.org/).
- [MiranoVerhoef/BeszelAgentManager](https://github.com/MiranoVerhoef/BeszelAgentManager) which uses WinGet.

### Edit configuration

Edit the service in NSSM by running the command below. Scroll to the right in the GUI to find environment variables.

```powershell
nssm edit beszel-agent
```

You can also change options directly from the command line:

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:"
```

Restart the service when finished: `nssm restart beszel-agent`

### Logs

Logs are saved in `C:\ProgramData\beszel-agent\logs`.

### Upgrade

#### Scoop

```powershell
nssm stop beszel-agent; & scoop update beszel-agent; & nssm start beszel-agent
```

#### WinGet

See [Upgrading with WinGet](./upgrade-winget.md).

### Uninstall

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

See the [Home Assistant Agent page](./home-assistant.md) for instructions on setting up the agent as a Home Assistant add-on.
