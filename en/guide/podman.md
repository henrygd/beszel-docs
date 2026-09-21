# Podman Monitoring

Note that currently this is an either-or situation. You can either use the Podman API or the Docker API, but not both at the same time. If you need both, let me know and I'll add it at some point.

## Start and enable the Podman API

This runs the REST API service as a regular user on any Linux machine with Podman installed:

```bash
systemctl --user enable podman.socket
systemctl --user start podman.socket
```

Restart the agent to allow it to connect to the Podman API.

### Rootful Podman

If Podman runs as root, enable the system-wide socket instead:

```bash
sudo systemctl enable --now podman.socket
```

The socket is at `/run/podman/podman.sock`. The agent only detects the rootless socket automatically, so set `DOCKER_HOST` to point at the rootful one:

```bash
DOCKER_HOST=unix:///run/podman/podman.sock
```

For a container agent, also mount the socket:

```bash
podman run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  -v /run/podman/podman.sock:/run/podman/podman.sock:ro \
  -e DOCKER_HOST=unix:///run/podman/podman.sock \
  -e KEY="<public key>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

If you see `permission denied` on a system with SELinux (Fedora, RHEL, etc.), see [SELinux](#selinux).

## Granting Permissions

The agent requires read/write access to the Podman socket. This can be achieved in various ways:

- Running the agent as the same user that runs Podman
- Creating a proxy socket
- Changing the socket directory ownership and permissions
- Using ACLs

The first two methods are covered below:

:::: details Running as the same user (container or binary agent)

### Container

If running as a Podman container, mount the Podman socket directly:

```bash
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /run/user/1000/podman/podman.sock:/run/user/1000/podman/podman.sock:ro \
  -e KEY="<public key>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

::: tip Note
Replace 1000 with your actual user ID if different. You can find it by running `id -u`
:::

### Binary agent

If running binary agent, change the user to the same user that runs Podman. With systemd, for example, if Podman is running as user `1000`, change the user to `1000` in the service file `/etc/systemd/system/beszel-agent.service`:

```ini
[Service]
User=1000
```

Restart the agent to allow it to connect to the Podman API.

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent.service
```

::::


:::: details Creating a proxy socket (binary agent)

Create a proxy socket that the `beszel` user can access:

```bash
sudo groupadd podman-socket
sudo usermod -aG podman-socket-proxy $USER
sudo usermod -aG podman-socket-proxy beszel
cat > ~/.config/systemd/user/podman-socket-proxy.service << 'EOF'
[Unit]
Description=Podman socket proxy for beszel
After=network.target podman.socket
Wants=podman.socket
Requires=podman.socket

[Service]
Type=simple
ExecStartPre=/usr/bin/mkdir -p /run/podman-socket-proxy
ExecStartPre=/usr/bin/chown %u:podman-socket-proxy /run/podman-socket-proxy
ExecStart=/usr/bin/socat UNIX-LISTEN:/run/podman-socket-proxy/podman.sock,fork,user=%u,group=podman-socket-proxy,mode=0660 UNIX-CONNECT:%t/podman/podman.sock
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl --user daemon-reload
systemctl --user enable --now podman-socket-proxy.service
```

Add the `DOCKER_HOST` environment variable to your agent's service file `/etc/systemd/system/beszel-agent.service`:

```ini
[Service]
Environment="DOCKER_HOST=unix:///run/podman-socket-proxy/podman.sock"  # [!code ++]
```

Restart the agent to allow it to connect to the Podman API.

```bash
sudo systemctl restart beszel-agent.service
```

::::

## SELinux

On systems with SELinux enforcing (Fedora, RHEL, CentOS, Rocky Linux), a containerized agent may be blocked from connecting to the Podman socket, even when the file permissions are correct. The agent logs:

```
Containers err="Get \"http://localhost/containers/json\": dial unix /run/podman/podman.sock: connect: permission denied"
```

You can confirm SELinux is the cause by checking the audit log:

```bash
sudo ausearch -m avc -ts recent | grep podman
```

A denial looks like `denied { connectto } ... scontext=...:container_t:s0 tcontext=...:container_runtime_t:s0`. The agent runs as `container_t`, which isn't allowed to connect to a socket owned by the container runtime.

To fix it, run the agent container with the `container_runtime_t` SELinux type:

::: code-group

```yaml [docker-compose.yml]
services:
  beszel-agent:
    image: henrygd/beszel-agent
    container_name: beszel-agent
    restart: unless-stopped
    network_mode: host
    security_opt:
      - label=type:container_runtime_t # [!code ++]
    volumes:
      - ./beszel_agent_data:/var/lib/beszel-agent:Z
      - /run/podman/podman.sock:/run/podman/podman.sock:ro
    environment:
      DOCKER_HOST: unix:///run/podman/podman.sock
```

```bash [podman run]
podman run -d \
  --name beszel-agent \
  --network host \
  --restart unless-stopped \
  --security-opt label=type:container_runtime_t \
  -v ./beszel_agent_data:/var/lib/beszel-agent:Z \
  -v /run/podman/podman.sock:/run/podman/podman.sock:ro \
  -e DOCKER_HOST=unix:///run/podman/podman.sock \
  -e KEY="<public key>" \
  docker.io/henrygd/beszel-agent:latest
```

:::

::: warning Do not add `:Z` to the socket mount
`:Z` relabels the host path, which is not what you want for the Podman socket. Use `:Z` only on data volumes like `beszel_agent_data`.
:::

::: tip Note
`container_runtime_t` gives the container the same SELinux type as the container runtime, which is more access than a normal container has. If that's a concern, you can write a custom SELinux policy module that only allows `connectto` on the socket, or run the agent as a binary instead.
:::
