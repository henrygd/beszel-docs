# Network Monitoring

Beszel agents can probe targets you define and report response time and packet loss. Use it to watch your gateway, DNS resolvers, internal services, or websites from the point of view of each system.

Network monitoring requires agent version `0.20.0` or later. Everything is configured in the hub UI. There are no agent environment variables or flags.

## Adding monitors {#add}

Open **Network Monitors** from the navbar and click **Add Monitor**. Choose one or more systems, then set:

| Field    | Description                                                                 |
| :------- | :-------------------------------------------------------------------------- |
| Target   | Hostname, IP address, or URL to probe.                                      |
| Protocol | `ICMP`, `TCP`, `HTTP`, or `DNS`. See [Protocols](#protocols).               |
| Port     | TCP only. Defaults to `443`.                                                |
| Interval | Seconds between probes, from `1` to `3600`. Defaults to `30`.               |
| Keyword  | HTTP only. Text the response must contain. See [Checking the response](#content). |
| JSON path | HTTP only. Path to a value in a JSON response to compare with the keyword. |
| Record type | DNS only. `A`, `AAAA`, `CNAME`, `MX`, `NS`, or `TXT`. Defaults to an `A` and `AAAA` lookup. |
| Expected value | DNS only. Value one of the returned records must match. |

Selecting several systems creates one monitor per system. Each agent runs its own probes, so results reflect that system's network.


## Protocols {#protocols}

| Protocol | What is measured                                               | Timeout | Counted as loss when                             |
| :------- | :------------------------------------------------------------- | :------ | :----------------------------------------------- |
| `icmp`   | Round-trip time of an echo request (IPv4 or IPv6).             | 3s      | No reply.                                        |
| `tcp`    | Time to open a connection to the port. DNS lookup is excluded. | 3s      | The connection fails or times out.               |
| `http`   | Time for a `GET` request to return a response.                 | 10s     | The request fails, the status is `400` or above, or the [response check](#content) fails. |
| `dns`    | Time to resolve the target hostname.                           | 3s      | The lookup fails, returns no records, or the [response check](#content) fails. |

- Hostnames that resolve to both IPv4 and IPv6 use IPv4 for `icmp`.
- For `http`, a target without a scheme gets `https://` prepended (or `http://` if the port is `80`). Redirects are followed.

## Checking the response {#content}

A target can answer and still be broken, such as a page that returns `200` with an error message or a DNS name that points to the wrong server. `http` and `dns` monitors can check what the target returns. A failed check counts as loss, and the reason is written to the agent log.

Agents that predate these options ignore them and only check that the target answers.

### HTTP keyword and JSON path

- **Keyword**: the response body must contain this text. The match is case-sensitive.
- **JSON path**: the response must be JSON, and the value at this path must equal the keyword exactly. With a JSON path and no keyword, the path only has to exist.

A JSON path is a list of keys separated by dots. Use a number to pick an item from an array. For this response:

```json
{ "status": "UP", "services": [{ "name": "db", "healthy": true }] }
```

| JSON path            | Keyword | Result                         |
| :------------------- | :------ | :----------------------------- |
| `status`             | `UP`    | Success.                       |
| `services.0.healthy` | `true`  | Success.                       |
| `services.0.name`    | `cache` | Loss, because the value is `db`. |
| `version`            |         | Loss, because the path is missing. |

The path must point to a string, number, boolean, or `null`, not to an object or array. Only the first 1 MB of the response body is read, and reading the body is not part of the response time.

### DNS record type and expected value

By default, a `dns` monitor resolves the target's `A` and `AAAA` records. Choose a **Record type** to query `A`, `AAAA`, `CNAME`, `MX`, `NS`, or `TXT` records instead. The probe counts as loss if the target has no records of that type.

Set an **Expected value** to also check the answer. The probe succeeds if at least one returned record matches:

| Record type        | Matches when                                                    | Example            |
| :----------------- | :-------------------------------------------------------------- | :----------------- |
| `A`, `AAAA`        | The address is the same.                                        | `192.0.2.10`       |
| `CNAME`, `MX`, `NS` | The host name is the same. Case and a trailing dot are ignored. | `mail.example.com` |
| `TXT`              | The record contains the text.                                   | `v=spf1`           |

Probes start at a random offset within the first interval so monitors do not all fire at once. If a probe takes longer than the interval, the missed ticks are skipped rather than queued.

## ICMP requirements {#icmp}

ICMP needs permission to send echo requests. The agent tries the following methods in order and uses the first one that works:

1. A raw socket, which needs root or the `CAP_NET_RAW` capability.
2. An unprivileged datagram socket, if the system allows it.
3. The system `ping` command, if it is installed.

`tcp`, `http`, and `dns` monitors need no special permissions.

### Docker agent

The default agent image contains only the agent binary, so the `ping` fallback is not available. Raw sockets work in containers running as root with Docker's default capabilities. If you drop capabilities or use a runtime that does not grant `NET_RAW`, add it back:

```yaml
beszel-agent:
  image: henrygd/beszel-agent
  cap_add:
    - NET_RAW
```

### Binary agent

If the agent does not run as root, grant it the capability. For a systemd service, add this to the `[Service]` section:

```ini
AmbientCapabilities=CAP_NET_RAW
CapabilityBoundingSet=CAP_NET_RAW
```

If you already set these for [S.M.A.R.T. data](./smart-data), list all capabilities on the same lines instead of adding duplicate entries:

```ini
AmbientCapabilities=CAP_SYS_RAWIO CAP_SYS_ADMIN CAP_NET_RAW
CapabilityBoundingSet=CAP_SYS_RAWIO CAP_SYS_ADMIN CAP_NET_RAW
```

Reload systemd and restart the agent after editing the service file.

::: tip
Set the agent's `LOG_LEVEL` to `debug` to see which ICMP method was chosen.
:::


## Editing and pausing

- Pausing a monitor removes it from the agent and stops probing. Resuming starts it again.
- Changing the target, protocol, port, or DNS record type creates a new monitor, so its history starts over. Changing the interval, keyword, or JSON path keeps the history.
- Agents receive their monitors from the hub whenever they connect. New monitors on a connected system start right away.


## Alerts

If at least one notification channel is configured, a **Network Monitor Loss** alert triggers a notification when a monitor's packet loss over the past hour exceeds the threshold you set on the system's alerts sheet (default 5%). The alert is resolved when loss returns to the threshold or below.

Each monitor is tracked separately. The alert needs at least three probes before it can fire, and deleting or pausing a monitor closes its alert without a notification.
