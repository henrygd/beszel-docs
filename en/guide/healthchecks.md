# Healthchecks

Both the hub and agent have `health` commands that can be used for Docker healthchecks.

They add a bit of CPU overhead, so we recommend using an interval of `60s` or more.

## Agent example

The agent healthcheck tests if the SSH server is listening.

```yaml
services:
  beszel-agent:
    healthcheck:
      test: ['CMD', '/agent', 'health'] # Run the health command
      start_period: 5s # Check 5 seconds after the container starts
      interval: 120s # Then check every 120 seconds after that
```

## Hub example

The hub healthcheck tests if the `/api/health` endpoint returns a 200 status code.

```yaml
services:
  beszel-hub:
    healthcheck:
      # The URL is relative to the container, not the host
      test: ['CMD', '/beszel', 'health', '--url', 'http://localhost:8090']
      start_period: 5s # Check 5 seconds after the container starts
      interval: 120s # Then check every 120 seconds after that
```
