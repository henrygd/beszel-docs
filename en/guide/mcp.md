# MCP Server

The hub includes an optional [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server, which lets AI assistants such as Claude Code, Cursor, or VS Code read your monitoring data. You can ask questions like "which container is using the most memory?" or "what caused the CPU spike on my NAS last night?" and the assistant looks up the answer in Beszel.

The MCP server requires hub version `0.22.0` or later. It is read-only: assistants can view data, but can't change settings, add or remove systems, or run commands on your systems.

## Enable the server {#enable}

The server is disabled by default. Set the `MCP` environment variable to `true` on the hub and restart it:

::: code-group

```yaml [docker-compose.yml]
services:
  beszel:
    image: henrygd/beszel
    environment:
      - BESZEL_HUB_MCP=true
```

```bash [Binary]
BESZEL_HUB_MCP=true ./beszel serve
```

:::

The server is then available at your hub URL followed by `/mcp`, for example `https://beszel.example.com/mcp`. If you [serve the hub at a subpath](./reverse-proxy), include it: `https://example.com/beszel/mcp`.

## Create an API key {#api-key}

Assistants sign in with an API key. Each user creates their own key in the web UI under **Settings > API Keys**.

- A key has the same access as your account, so the assistant sees the same systems you see in the web UI.
- Choose an expiration of 1 day to 1 year, or never. Expiring keys are recommended.
- The key is shown only once. Copy it into your MCP client right away.
- **Revoke all API keys** invalidates every key you have created and signs you out of other devices. Changing your password has the same effect.

## Connect a client {#connect}

Clients connect over the streamable HTTP transport and send the key in the `Authorization` header as `Bearer <key>`. Replace the URL and `YOUR_API_KEY` in the examples below with your own.

::: code-group

```bash [Claude Code]
claude mcp add --transport http beszel https://beszel.example.com/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

```json [Cursor (mcp.json)]
{
  "mcpServers": {
    "beszel": {
      "url": "https://beszel.example.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

```json [VS Code (.vscode/mcp.json)]
{
  "inputs": [
    {
      "type": "promptString",
      "id": "beszel-api-key",
      "description": "Beszel API key",
      "password": true
    }
  ],
  "servers": {
    "beszel": {
      "type": "http",
      "url": "https://beszel.example.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:beszel-api-key}"
      }
    }
  }
}
```

:::

Other clients work the same way, as long as they support streamable HTTP and let you set a custom `Authorization` header. Clients that can't send a custom header can't connect.

::: tip
Most clients store the key in plain text in their config file. Use an expiring key, and keep the file out of version control.
:::

## What assistants can do {#tools}

The server provides these tools. The assistant chooses which to call based on your question.

| Tool                    | Description                                                                                                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `list_systems`          | All your systems with status and current CPU, memory, disk, bandwidth, temperature, load average, battery, Wi-Fi signal, and pending package updates.                                            |
| `get_system`            | One system's hardware details (CPU model, cores, memory, OS, kernel) and current sensor readings: all temperatures, fans, GPUs, swap, and extra filesystems.                                      |
| `get_system_stats`      | Historical CPU, memory, disk, network, and disk I/O for one system, with averages and peaks. Works for any time range within the [retention period](#history), including past windows.           |
| `get_container_stats`   | Historical CPU, memory, and network usage of one system's containers, with each container's average and peak values and when the peak happened.                                                 |
| `list_containers`       | Current Docker / Podman containers with status, health, image, CPU, memory, and network usage.                                                                                                   |
| `list_services`         | [Systemd services](./systemd) with state, CPU, and memory usage.                                                                                                                                  |
| `get_disk_health`       | [S.M.A.R.T. data](./smart-data) (status, temperature, power-on hours) and ZFS / Btrfs [storage pool](./storage-pools) health.                                                                   |
| `list_network_monitors` | [Network monitors](./network-monitors) with latest latency and 1-hour latency and packet loss.                                                                                                   |
| `list_alerts`           | Your alert configurations and whether each is currently triggered.                                                                                                                                |
| `list_alert_events`     | History of your triggered and resolved alerts, up to 30 days back.                                                                                                                                |

`list_containers`, `list_services`, `get_disk_health`, and `list_network_monitors` can search all of your systems at once, so questions like "are any services failing?" don't require checking each system separately.

### Example questions {#examples}

- Which systems are down, and when were they last seen?
- Which container is using the most memory across all my systems?
- Are any disks failing or any storage pools degraded?
- Are any systemd services in a failed state?
- What alerts fired this week, and are they resolved?
- CPU on `nas` spiked around 3 AM. Which container caused it?
- How has memory usage on `web-1` changed over the last 7 days?
- Which network monitors have the most packet loss?

### Historical data {#history}

History is stored at several resolutions, and older data is kept at coarser resolutions. Assistants can look back up to 30 days, and the level of detail depends on how far back the time range starts:

| Resolution | Kept for |
| :--------- | :------- |
| 1 minute   | 1 hour   |
| 10 minutes | 12 hours |
| 20 minutes | 24 hours |
| 2 hours    | 7 days   |
| 8 hours    | 30 days  |

For example, an assistant investigating a spike from 12 hours ago gets 20-minute data, so very short spikes may be averaged out.

Container history includes CPU, memory, and network usage. Container status and health checks are not stored over time.

## Access and privacy {#access}

- The assistant sees exactly what the API key's user sees in the web UI: systems shared with that user, or all systems if [`SHARE_ALL_SYSTEMS`](./environment-variables#share-all-systems) is enabled. Alerts and alert history are limited to the user's own alerts.
- Users with the `readonly` role can use the MCP server, since it never changes data.
- Data the assistant reads, such as system names, hostnames, container names, and metrics, is sent to the AI model your client uses. Consider this before connecting a hosted AI service to a hub with sensitive systems.

## Troubleshooting {#troubleshooting}

**404 Not Found**: The MCP server is not enabled. Set `BESZEL_HUB_MCP=true` and restart the hub.

**401 Unauthorized**: The key is missing, invalid, expired, or revoked. Create a new key in **Settings > API Keys** and check that the client sends it as `Authorization: Bearer <key>`.

**Reverse proxy issues**: Make sure the proxy forwards requests to `/mcp`, including the `Authorization` header.

**405 Method Not Allowed**: This is expected for `GET` and `DELETE` requests. The server only uses `POST`, so it doesn't keep sessions or open event streams. Clients that require the older SSE transport are not supported.
