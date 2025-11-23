# Podman 监控

请注意，目前这是一个非此即彼的情况。您可以使用 Podman API 或 Docker API，但不能同时使用两者。如果您都需要，请告诉我，我稍后会添加它。

## 启动并启用 Podman API

以下命令可在安装了 Podman 的任何 Linux 机器上以普通用户身份运行 REST API 服务：

```bash
systemctl --user enable podman.socket
systemctl --user start podman.socket
```

重新启动代理以使其连接到 Podman API。

## 授予权限

代理程序需要对 Podman 套接字的读/写访问权限。这可以通过多种方式实现：

- 以运行 Podman 的相同用户身份运行代理程序
- 创建代理套接字
- 更改套接字目录的所有权和权限
- 使用 ACL

下面介绍了前两种方法：

:::: details 以相同用户身份运行（容器或二进制代理程序）

### 容器

如果作为 Podman 容器运行，请直接挂载 Podman 套接字：

```bash
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /run/user/1000/podman/podman.sock:/run/user/1000/podman/podman.sock:ro \
  -e KEY="<公钥>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

::: tip 注意
如果不同，请将 1000 替换为您的实际用户 ID。您可以通过运行 `id -u` 来找到它
:::

### 二进制代理程序

如果运行二进制代理程序，请将用户更改为运行 Podman 的相同用户。例如，如果 Podman 以用户 `1000` 身份运行，请在服务文件 `/etc/systemd/system/beszel-agent.service` 中将用户更改为 `1000`：

```ini
[Service]
User=1000
```

重新启动代理以使其连接到 Podman API。

```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent.service
```

::::

:::: details 创建代理套接字（二进制代理程序）

创建 `beszel` 用户可以访问的代理套接字：

```bash
sudo groupadd podman-socket
sudo usermod -aG podman-socket-proxy $USER
sudo usermod -aG podman-socket-proxy beszel
cat > ~/.config/systemd/user/podman-socket-proxy.service << 'EOF'
[Unit]
Description=Beszel 的 Podman 套接字代理
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

将 `DOCKER_HOST` 环境变量添加到您的代理程序服务文件 `/etc/systemd/system/beszel-agent.service` 中：

```ini
[Service]
Environment="DOCKER_HOST=unix:///run/podman-socket-proxy/podman.sock"  # [!code ++]
```

重新启动代理以使其连接到 Podman API。

```bash
sudo systemctl restart beszel-agent.service
```

::::
