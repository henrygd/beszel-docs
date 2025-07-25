:::: details Click to view complete `docker-compose.yml` config including local agent

::: tip IMPORTANT

This configuration should work out of the box, but you must follow these steps when adding the system in the web UI:

1. Update the `KEY` and `TOKEN` environment variables with your public key and token, then restart the agent:

```
docker compose up -d
```

2. Use the unix socket path as the **Host / IP** in the web UI:

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
      TOKEN: <token>
      KEY: "<key>"
```

::::

:::: details Click to view instructions for running `docker compose`

::: tip NOTE
If you prefer to set up containers in a different way, please feel free to do so.
:::

1. Install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) if you haven't already.

2. Copy the `docker-compose.yml` content.

3. Create a directory somewhere to store the `docker-compose.yml` file.

```bash
mkdir beszel
cd beszel
```

4. Create a `docker-compose.yml` file, paste in the content, and save it.

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

5. Start the service.

```bash
docker compose up -d
```

::::
