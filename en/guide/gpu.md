# GPU Monitoring

Beszel can monitor GPU usage, temperature, and power draw.

## AMD GPUs

::: info Work in progress
AMD has deprecated `rocm-smi` in favor of `amd-smi`. The agent works with `rocm-smi` on Linux, but hasn't been updated to work with `amd-smi` yet.
:::

Beszel uses `rocm-smi` to monitor AMD GPUs. This must be available on the system, and you must use the binary agent (not the Docker agent).

#### Make sure <code>rocm-smi</code> is accessible

Installing `rocm-smi-lib` on Arch and Debian places the `rocm-smi` binary in `/opt/rocm`. If this isn't in the `PATH` of the user running `beszel-agent`, symlink to `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Nvidia GPUs

### Docker agent

Make sure NVIDIA Container Toolkit is installed on the host system.

Use `henrygd/beszel-agent-nvidia` and add the following `deploy` block to your `docker-compose.yml`.

```yaml
beszel-agent:
  image: henrygd/beszel-agent-nvidia
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: all
            capabilities:
              - utility
```

### Binary agent

You must have `nvidia-smi` available on the system.

If it doesn't work, you may need to allow access to your devices in the service configuration. See [discussion #563](https://github.com/henrygd/beszel/discussions/563#discussioncomment-12230389) for more information.

```ini
[Service]
DeviceAllow=/dev/nvidiactl rw
DeviceAllow=/dev/nvidia0 rw
# If you have multiple GPUs, make sure to allow all of them
DeviceAllow=/dev/nvidia1 rw
DeviceAllow=/dev/nvidia2 rw
```

```bash
systemctl daemon-reload
systemctl restart beszel-agent
```

## Nvidia Jetson

You must use the binary agent and have `tegrastats` installed.

The `henrygd/beszel-agent-nvidia` image likely doesn't work, but I can't test it to confirm. Let me know one way or the other if you try it :).

## Intel GPUs

Note that only one GPU per system is supported. We may add support for multiple GPUs in the future.

### Docker agent

Use the `henrygd/beszel-agent-intel` image with the additional options below.

```yaml
beszel-agent:
  image: henrygd/beszel-agent-intel
  cap_add:
    - CAP_PERFMON
  devices:
    - "/dev/dri:/dev/dri"
```

The Docker image is fresh out of the oven and still being tested.

### Binary agent

You must have `intel_gpu_top` installed. This is typically part of the `intel-gpu-tools` package.

::: code-group

```bash [Debian / Ubuntu]
sudo apt install intel-gpu-tools
```

```bash [Arch]
sudo pacman -S intel-gpu-tools
```

:::

Assuming you're not running the agent as root, you'll need to set the `cap_perfmon` capability on the `intel_gpu_top` binary.

```bash
sudo setcap cap_perfmon=ep /usr/bin/intel_gpu_top
```

If the data still doesn't show up, please confirm that running `intel_gpu_top` directly on the system works before opening an issue.
