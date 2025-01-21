# Docker Shell

Beszel 使用了一个没有 Shell 的 [scratch 镜像](https://hub.docker.com/_/scratch)。这意味着您无法使用 `docker exec -it <容器> /bin/sh` 从容器内部进行调试。

不过，您可以使用 `build` 选项配合自定义的 Dockerfile，将二进制文件移动到您选择的基础镜像中。

## 创建 Dockerfile

将以下内容保存为 `Dockerfile`，并放在与 `docker-compose.yml` 相同的目录中：

::: code-group

```dockerfile [Hub]
FROM henrygd/beszel:latest as beszel

# 定义新的基础镜像
FROM alpine:latest

# 添加工具（curl、telnet、traceroute、netstat、host、nslookup、dig、delv）
RUN apk add --no-cache bash curl busybox-extras bind-tools

# 将二进制文件复制到新镜像中
COPY --from=beszel /beszel /beszel

ENTRYPOINT [ "/beszel" ]
CMD ["serve", "--http=0.0.0.0:8090"]
```

```dockerfile [Agent]
FROM henrygd/beszel-agent:latest as beszel

# 定义新的基础镜像
FROM alpine:latest

# 添加工具（curl、telnet、traceroute、netstat、host、nslookup、dig、delv）
RUN apk add --no-cache bash curl busybox-extras bind-tools

# 将二进制文件复制到新镜像中
COPY --from=beszel /agent /agent

ENTRYPOINT ["/agent"]
```

:::

## 更新您的 `docker-compose.yml`

移除 `image` 键，并在服务中添加 `build` 键：

::: code-group

```yaml [Hub]
beszel:
  image: henrygd/beszel # [!code --]
  build: . # [!code ++]
```

```yaml [Agent]
beszel-agent:
  image: henrygd/beszel-agent # [!code --]
  build: . # [!code ++]
```

:::

## 重启容器并访问 Shell

```bash
docker-compose up -d --build
docker exec -it <容器> bash
```

## 在一个 compose 文件中使用多个 Dockerfile

如果您的 Hub 和 Agent 共享同一个 compose 文件，并且您希望调试两者，可以使用此方法。

将 Dockerfile 保存为不同的名称，例如 `Dockerfile_hub` 和 `Dockerfile_agent`，并更新 `docker-compose.yml` 中的 `build` 键：

```yaml
beszel:
  build:
    context: .
    dockerfile: Dockerfile_hub

beszel-agent:
  build:
    context: .
    dockerfile: Dockerfile_agent
```
