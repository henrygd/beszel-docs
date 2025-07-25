:::: details 单击查看完整的 `docker-compose.yml` 配置，包括本地代理

::: tip 重要

此配置通常可以直接使用，但在 Web 界面添加系统时需要执行以下步骤：

1. 使用您的公钥和令牌更新 `KEY` 和 `TOKEN` 环境变量，然后重新启动代理：

```
docker compose up -d
```

2. 在 Web 界面中使用 Unix 套接字路径作为 **主机/IP**：

```
/beszel_socket/beszel.sock
```

:::

::: code-group

```yaml [docker-compose.yml]
services:
  beszel:
    image: henrygd/beszel:latest
    container_name: beszel
    restart: unless-stopped
    ports:
      - 8090:8090
    volumes:
      - ./beszel_data:/beszel_data
      - ./beszel_socket:/beszel_socket

  beszel-agent:
    image: henrygd/beszel-agent:latest
    container_name: beszel-agent
    restart: unless-stopped
    network_mode: host
    volumes:
      - ./beszel_agent_data:/var/lib/beszel-agent
      - ./beszel_socket:/beszel_socket
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      LISTEN: /beszel_socket/beszel.sock
      HUB_URL: http://localhost:8090
      TOKEN: <令牌>
      KEY: "<密钥>"
```

::::

:::: details 单击查看运行 `docker compose` 的说明

::: tip 注意

如果您更喜欢以不同的方式设置容器，请随意

:::

1. 如果尚未安装，请安装 [Docker](https://docs.docker.com/engine/install/) 和 [Docker Compose](https://docs.docker.com/compose/install/).

2. 复制 `docker-compose.yml` 内容

3. 创建一个目录用于存储 `docker-compose.yml` 文件

```bash
mkdir beszel
cd beszel
```

4. 创建一个 `docker-compose.yml` 文件，粘贴内容并保存

::: code-group

```bash [nano]
nano docker-compose.yml
```

```bash [vim]
vim docker-compose.yml
```

```bash [emacs]
emacs docker-compose.yml
```

```bash [vscode]
code docker-compose.yml
```

:::

5. 启动服务

```bash
docker compose up -d
```

::::
