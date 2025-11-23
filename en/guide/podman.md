# Podman Monitoring

Note that currently this is an either-or situation. You can either use the Podman API or the Docker API, but not both at the same time. If you need both, let me know and I'll add it at some point.

## Start and enable the Podman API

This runs the REST API service as a regular user on any Linux machine with Podman installed:

```bash
systemctl --user enable podman.socket
systemctl --user start podman.socket
```

Restart the agent to allow it to connect to the Podman API.

## Granting Permissions

The agent requires read/write access to the Podman socket. This can be achieved in various ways:

- creating a proxy socket
- running the agent as the same user that runs Podman
- changing the socket directory ownership and permissions
- using ACLs

Below, only the first two methods are covered for binary agent and agent running in podman container, respectively.

:::: details create a proxy socket for binary agent

Сreate a proxy socket that the `beszel` user can access:

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

:::: details Podman agent

Mount the Podman socket directly:

```bash
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /run/user/1000/podman/podman.sock:/var/run/docker.sock:ro \
  -e KEY="<public key>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

::: tip Note
Replace 1000 with your actual user ID if different. You can find it by running `id -u`
:::

::::
