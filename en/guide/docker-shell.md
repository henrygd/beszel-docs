# Docker Shell

Beszel uses a [scratch image](https://hub.docker.com/_/scratch) with no shell. This means you can't use `docker exec -it <container> /bin/sh` to debug from inside the container.

However, you can use the `build` option with a custom Dockerfile to move the binary into the base image of your choice.

## Create a Dockerfile

Save the following as `Dockerfile` in the same directory as your `docker-compose.yml`:

::: code-group

```dockerfile [Hub]
FROM henrygd/beszel:latest as beszel

# Define the new base image
FROM alpine:latest

# Add tools (curl, telnet, traceroute, netstat, host, nslookup, dig, delv)
RUN apk add --no-cache bash curl busybox-extras bind-tools

# Copy the binary into the new image
COPY --from=beszel /beszel /beszel

ENTRYPOINT [ "/beszel" ]
CMD ["serve", "--http=0.0.0.0:8090"]
```

```dockerfile [Agent]
FROM henrygd/beszel-agent:latest as beszel

# Define the new base image
FROM alpine:latest

# Add tools (curl, telnet, traceroute, netstat, host, nslookup, dig, delv)
RUN apk add --no-cache bash curl busybox-extras bind-tools

# Copy the binary into the new image
COPY --from=beszel /agent /agent

ENTRYPOINT ["/agent"]
```

:::

## Update your `docker-compose.yml`

Remove the `image` key and add a `build` key to your service:

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

## Restart the container and access the shell

```bash
docker-compose up -d --build
docker exec -it <container> bash
```

## Multiple Dockerfiles in one compose file

Use this approach if your hub and agent share the same compose file and you want to debug both.

Save the dockerfiles with different names, e.g. `Dockerfile_hub` and `Dockerfile_agent` and update the `build` key in your `docker-compose.yml`:

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
