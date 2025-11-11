# Systemd Services

Beszel provides a basic overview of systemd services, displaying their status, CPU usage, memory consumption, and other metrics.

## What Gets Displayed

The agent collects data for systemd services that have been active at least once (including failed or exited ones), showing:

- Service status (active, inactive, failed, etc.)
- CPU and memory usage
- Restart counts
- Service start/stop times
- Unit file state and description
- Lifecycle (became active, became inactive, etc.)

Notes:

- Peak memory usage covers the entire lifetime of the service if provided by systemd. Otherwise, it is the maximum memory usage during the monitoring period.
- Services will show 0% CPU usage on first connection. This is normal behavior - CPU usage will populate correctly on the next update cycle.

## Binary agent

When running the agent as a binary, no additional configuration is typically required for systemd monitoring. The agent runs with sufficient privileges to access systemd service information.

If services don't appear on the system page, check the agent logs for errors.

## Docker agent

Several approaches are available depending on your security requirements and system configuration. If you know of an alternative method not listed here, please let us know.

### Method 1: System Bus Socket

Mount the system D-Bus socket to allow the agent to communicate with systemd:

```yaml
services:
  beszel-agent:
    volumes:
      - /run/dbus/system_bus_socket:/run/dbus/system_bus_socket:ro
```

### Method 2: Systemd Private Socket

For systems where the D-Bus socket approach doesn't work, mount the systemd private socket:

```yaml
services:
  beszel-agent:
    volumes:
      - /run/systemd/private:/run/systemd/private:ro
```

### Method 3: Privileged Container (not recommended)

As a last resort, run the container with privileged access:

```yaml
services:
  beszel-agent:
    privileged: true
```

### Security Considerations
- **Method 1** is the most secure and recommended approach
- **Method 2** provides access to systemd internals but is more secure than **Method 3**
- **Method 3** gives the container full system access and should only be used when other methods fail

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

### Permission Errors

Common error messages and solutions:

- `Failed to connect to system bus`: Check D-Bus socket mounting in Docker
- `Access denied`: Agent may need additional capabilities or user permissions
- `Connection refused`: Systemd may not be running or socket paths may be incorrect
- `Rejected send message, 2 matched rules`: D-Bus policy is blocking access (common with systemd < 243).
- `Unknown method 'ListUnitsByPatterns'`: Method not supported in systemd < 243. Systemd monitoring will not work.

### Docker-Specific Issues

- **Socket not found**: Verify the host has the socket file at the expected path
- **Permission denied**: Container user may need different UID/GID mapping
- **Connection timeout**: Firewall rules may be blocking D-Bus communication

## Compatibility

**Systemd version**: Requires systemd 243+ for `ListUnitsByPatterns` method support