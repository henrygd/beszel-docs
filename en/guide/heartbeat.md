
# Heartbeat Monitoring

Beszel can send periodic outbound pings to an external monitoring endpoint (e.g., BetterStack, Uptime Kuma, Healthchecks.io). This allows you to monitor the health of your Beszel instance and the systems it tracks without exposing the hub to the internet.

## Configuration

The heartbeat functionality is configured via environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `HEARTBEAT_URL` | The external URL to ping. Feature is disabled if empty. | (empty) |
| `HEARTBEAT_INTERVAL` | Seconds between pings. | `60` |
| `HEARTBEAT_METHOD` | HTTP method to use (`GET`, `POST`, or `HEAD`). | `POST` |

## POST Payload Example

When using `POST` (the default), Beszel sends a JSON payload with detailed status information about your systems and triggered alerts.

### Example Payload

```json
{
  "status": "error",
  "timestamp": "2026-02-20T14:30:00Z",
  "msg": "1 system(s) down: Production-DB",
  "systems": {
    "total": 5,
    "up": 3,
    "down": 1,
    "paused": 1,
    "pending": 0
  },
  "down_systems": [
    {
      "id": "abc123def456",
      "name": "Production DB",
      "host": "db.example.com"
    }
  ],
  "triggered_alerts": [
    {
      "system_id": "xyz789ghi012",
      "system_name": "Web Server 01",
      "alert_name": "CPU",
      "threshold": 80
    }
  ],
  "beszel_version": "0.18.4"
}
```