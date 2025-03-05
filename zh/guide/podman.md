# Podman 监控

请注意，目前这是一个非此即彼的情况。您可以使用 Podman API 或 Docker API，但不能同时使用两者。如果您都需要，请告诉我，我稍后会添加它。

## 启动并启用 Podman API

以下命令可在安装了 Podman 的任何 Linux 机器上以普通用户身份运行 REST API 服务：

```bash
systemctl --user enable podman.socket
systemctl --user start podman.socket
```

重新启动代理以使其连接到 Podman API。

## 权限

您必须以运行 Podman 的相同用户身份运行代理程序。

::: code-group

```ini [beszel-agent.service]
[Service]
User=beszel # [!code --]
User=1000 # [!code ++]
```

```bash [podman run]
podman run -d \
  --name beszel-agent \
  --user 1000 \
  --network host \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -e KEY="<public key>" \
  -e LISTEN=45876 \
  docker.io/henrygd/beszel-agent:latest
```

::: code-group

## 指定不同的套接字路径

代理程序会在 `/run/user/{uid}/podman/podman.sock` 处检查 Podman 套接字。

如果您需要使用不同的路径，请在 `DOCKER_HOST` 环境变量中指定它：`DOCKER_HOST=unix:///path/to/podman.sock`
