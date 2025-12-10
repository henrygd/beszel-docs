# GPU Monitoring

Beszel can monitor GPU usage, temperature, and power draw.

## AMD GPUs {#amd}

::: info Work in progress
AMD has deprecated `rocm-smi` in favor of `amd-smi`. The agent works with `rocm-smi` on Linux, but hasn't been updated to work with `amd-smi` yet.
:::

Beszel uses `rocm-smi` to monitor AMD GPUs. This must be available on the system, and you must use the binary agent (not the Docker agent).

#### Make sure <code>rocm-smi</code> is accessible

Installing `rocm-smi-lib` on Arch and Debian places the `rocm-smi` binary in `/opt/rocm`. If this isn't in the `PATH` of the user running `beszel-agent`, symlink to `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Nvidia GPUs {#nvidia}

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

### Binary agent {#nvidia-binary}

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

### Power Usage Warning

`nvidia-smi` prevents NVIDIA GPUs from entering RTD3 power saving mode which leads increased power consumption. On laptops this can drastically reduce idle battery life.

You may prevent this by disabling GPU monitoring via `SKIP_GPU=true`. 

## Nvidia Jetson {#nvidia-jetson}

You must use the binary agent and have `tegrastats` installed.

## Intel GPUs {#intel}

Note that only one GPU per system is supported. We may add support for multiple GPUs in the future.

### Docker agent {#intel-docker}

Use the `henrygd/beszel-agent-intel` image with the additional options below.

```yaml
beszel-agent:
  image: henrygd/beszel-agent-intel
  cap_add:
    - CAP_PERFMON
  devices:
    - /dev/dri/card0:/dev/dri/card0
```

Use `ls /dev/dri` to find the name of your GPU:

```bash
ls /dev/dri
```

```
by-path  card0  renderD128
```

### Binary agent {#intel-binary}

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

If running the agent as a systemd service, [add the `CAP_PERFMON` ambient capability](./environment-variables.md#systemd) to the `beszel-agent` service so that non-root services can still access performance counters:

```ini
[Service]
AmbientCapabilities=CAP_PERFMON
```

This is required because file-based capabilities set with `setcap` on `intel_gpu_top` are not inherited by child processes when the service is run as a non-root user. See [issue #1480](https://github.com/henrygd/beszel/issues/1480) for additional context.


### Troubleshooting {#intel-troubleshooting}

To independently test the `intel_gpu_top` command:

```bash
# docker
docker exec -it beszel-agent intel_gpu_top -s 3000 -l
# binary
sudo -u beszel intel_gpu_top -s 3000 -l
```

#### Specify the device name

On some systems you need to specify the device name for `intel_gpu_top`. Use the `INTEL_GPU_DEVICE` environment variable to set the `-d` value.

```dotenv
INTEL_GPU_DEVICE=drm:/dev/dri/card0
```

This is equivalent to running `intel_gpu_top -s 3000 -l -d drm:/dev/dri/card0`.

#### Lower the `perf_event_paranoid` kernel parameter

You may need to lower the value for the `perf_event_paranoid` kernel parameter. See [issue #1150](https://github.com/henrygd/beszel/issues/1150) or [#1203](https://github.com/henrygd/beszel/issues/1203#issuecomment-3336457430) for more information.

```bash
sudo sysctl kernel.perf_event_paranoid=2
```

To make this change persistant across reboots you need to add it to the `sysctl` configuration

```bash
echo "kernel.perf_event_paranoid=2" | sudo tee /etc/sysctl.d/99-intel-gpu-beszel.conf
sudo sysctl --system
```