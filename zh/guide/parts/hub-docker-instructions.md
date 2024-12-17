:::: details 单击查看完整的 `docker-compose.yml` 配置，包括本地代理

::: tip 重要

此配置应该可以直接使用，但是您在 Web 界面添加新系统时必须遵循以下步骤

1. 使用您的公钥更新 `KEY` 值，然后再次运行 `docker compose up -d` 以重新启动代理

2. 将 `host.docker.internal` 用作 **主机/IP**。 请勿使用 `localhost` 或 `127.0.0.1`

:::

::: code-group

```yaml [docker-compose.yml]
services:
  beszel:
    image: henrygd/beszel:latest
    container_name: beszel
    restart: unless-stopped
    extra_hosts:
      - host.docker.internal:host-gateway
    ports:
      - 8090:8090
    volumes:
      - ./beszel_data:/beszel_data

  beszel-agent:
    image: henrygd/beszel-agent:latest
    container_name: beszel-agent
    restart: unless-stopped
    network_mode: host
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      PORT: 45876
      # 请勿删除密钥周围的引号
      KEY: '使用“添加系统”对话框复制的公钥进行更新'
```

::::

:::: details 单击查看在 Linux 上运行 `docker compose` 的说明

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