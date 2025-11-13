# Systemd Services

Beszel provides a basic overview of systemd services, displaying their status, CPU usage, memory consumption, and other metrics.

## What Gets Displayed

The agent collects data for systemd services that have been active at least once (including failed or exited ones), showing:

- Service status (active, inactive, failed, etc.)
- CPU and memory usage
- Restart counts
- Unit file state and description
- Lifecycle (became active, became inactive, etc.)

Notes:

- Peak memory usage covers the entire lifetime of the service if provided by systemd. Otherwise, it is the maximum memory usage during the monitoring period.
- Services will show 0% CPU usage on first connection. This is normal behavior - CPU usage will populate correctly on the next update cycle.

## Binary agent

When running the agent as a binary, no additional configuration is typically required for systemd monitoring. The agent runs with sufficient privileges to access systemd service information.

If services don't appear on the system page, check the agent logs for errors.

## Docker agent

Mount the system D-Bus socket to allow the agent to communicate with systemd:

```yaml
services:
  beszel-agent:
    volumes:
      - /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket:ro
```

If logs show an AppArmor error, add the following security option:

```yaml
services:
  beszel-agent:
    security_opt:
      - apparmor:unconfined
```


If services still don't appear, try mounting the systemd private socket as well:

```yaml
services:
  beszel-agent:
    volumes:
      - /run/systemd/private:/run/systemd/private:ro
```

As a last resort, you can run the container with privileged access. This is useful for testing but not recommended for production.

```yaml
services:
  beszel-agent:
    privileged: true
```

<!-- ## User Services vs System Services

Systemd supports both system-wide services and user-specific services:

- **System services**: Run as root or dedicated system users, managed by `systemctl`
- **User services**: Run per-user, managed by `systemctl --user`

The agent monitors system services by default. User services require additional configuration and typically need the agent to run as the target user. -->

## Troubleshooting

### Services Not Appearing

1. Check agent logs for permission or connection errors
2. Verify systemd accessibility:
   ```bash
   dbus-send --system --dest=org.freedesktop.systemd1 --type=method_call --print-reply /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager.ListUnits
   ```
3. Check systemd version compatibility (requires systemd 243+ for `ListUnitsByPatterns` method support):
   ```bash
   systemctl --version
   ```
4. Verify agent permissions for accessing systemd services

### Common Errors

Common error messages and solutions:

#### `An AppArmor policy prevents this sender from sending this message to this recipient` { #apparmor-error }

Add the following to your `docker-compose.yml`:

```yaml
services:
  beszel-agent:
    security_opt:
      - apparmor:unconfined
```

#### `Unknown method 'ListUnitsByPatterns'`

Method not supported in systemd < 243. Upgrade to systemd 243 or later.

## Compatibility

**Systemd version**: Requires systemd 243+ for `ListUnitsByPatterns` method support