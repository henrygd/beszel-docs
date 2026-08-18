# GPU Monitoring

Beszel can monitor GPU usage, temperature, memory, and power draw for various GPU vendors and platforms.

## Automatic Detection

The agent automatically detects available GPU monitoring tools and selects the best one for your system. You can override this behavior using the `GPU_COLLECTOR` environment variable.

## Environment Variables

| Variable        | Description                                                         |
| :-------------- | :------------------------------------------------------------------ |
| `GPU_COLLECTOR` | Comma-separated list of collectors to use (e.g., `nvml,amd_sysfs`). |
| `SKIP_GPU`      | Set to `true` to disable all GPU monitoring.                        |

### Available Collectors

| Collector       | Description                                                            |
| :-------------- | :--------------------------------------------------------------------- |
| `nvml`          | NVIDIA Management Library (experimental).                              |
| `nvidia-smi`    | NVIDIA System Management Interface (default).                          |
| `amd_sysfs`     | Direct sysfs monitoring for AMD GPUs.                                  |
| `rocm-smi`      | ROCm System Management Interface (default if installed).               |
| `intel_sysfs`   | Direct sysfs monitoring for Intel GPUs on Linux (limited metrics).     |
| `intel_gpu_top` | Intel GPU monitoring.                                                  |
| `tegrastats`    | NVIDIA Jetson monitoring (default for NVIDIA Jetson).                  |
| `nvtop`         | Multi-vendor. Requires `nvtop` 3.3.2+. Cannot be combined with others. |
| `macmon`        | macOS GPU monitoring (Apple Silicon, experimental).                    |
| `powermetrics`  | macOS GPU monitoring (Apple Silicon, requires sudo, experimental).     |

## NVIDIA GPUs {#nvidia}

Available collectors: `nvidia-smi` (default), `nvml` (experimental), `nvtop`.

### Recommended: NVML

The experimental NVML integration allows GPUs to enter power-saving modes (RTD3) when idle, which `nvidia-smi` may prevent.

To enable, set `GPU_COLLECTOR=nvml`. Feedback is appreciated and can be left in [issue #1522](https://github.com/henrygd/beszel/issues/1522).

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

You may need to allow access to your devices in the service configuration. See [discussion #563](https://github.com/henrygd/beszel/discussions/563#discussioncomment-12230389) for more information.

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

## NVIDIA Jetson {#nvidia-jetson}

The binary agent should work automatically using `tegrastats`.

### Docker agent

The Docker agent requires a custom image and a bind mount for `tegrastats`.

#### 1. Create a custom Dockerfile

Create a `Dockerfile` in the same directory as your `docker-compose.yml`:

```dockerfile
FROM frolvlad/alpine-glibc:latest

COPY --from=henrygd/beszel-agent:latest /agent /agent
RUN chmod +x /agent

ENTRYPOINT ["/agent"]
```

#### 2. Update Docker Compose

Update your `docker-compose.yml` to use your custom image, and bind mount `tegrastats`:

```yaml
beszel-agent:
  build: .
  volumes:
    - /usr/bin/tegrastats:/usr/bin/tegrastats:ro
```

See [discussion #1600](https://github.com/henrygd/beszel/discussions/1600) for more information.

## AMD GPUs {#amd}

Available collectors: `amd_sysfs`, `nvtop`, `rocm-smi` (deprecated).

### Recommended: `amd_sysfs` (Linux)

Beszel can monitor AMD GPUs directly via sysfs, which is more efficient than `rocm-smi`.

If you have `rocm-smi` installed but want to use sysfs, set `GPU_COLLECTOR=amd_sysfs`.

### `rocm-smi` (Deprecated)

Beszel can also use `rocm-smi` to monitor AMD GPUs. This must be available on the system. Note that `rocm-smi` is deprecated and may be removed in a future release.

If `rocm-smi` isn't in the `PATH` of the user running `beszel-agent`, symlink it to `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Intel GPUs {#intel}

Available collectors: `intel_sysfs`, `intel_gpu_top`, `nvtop`.

### Intel Arc / Xe driver

Intel GPUs using the Xe kernel driver are supported through `nvtop`. Beszel automatically skips `intel_gpu_top` on Xe systems and uses `nvtop` when available.

`nvtop` provides GPU usage, temperature, power, and memory metrics on Xe. In Docker, add `pid: host` to the agent service for GPU utilization; without it, utilization reports 0% while temperature, power, and memory remain available.

### `intel_sysfs`

On Linux, `intel_sysfs` is automatically detected when compatible Intel DRM hwmon energy counters are available. It has no userspace tool dependency, but metric availability is limited to what the kernel exposes through sysfs and varies by driver and hardware.

On Xe, `intel_sysfs` can report power and temperature when those hwmon attributes are available, but GPU utilization and memory usage are not exposed. For more complete Xe monitoring, use `nvtop`.

You can select the sysfs collector explicitly with `GPU_COLLECTOR=intel_sysfs`.

### `intel_gpu_top`

`intel_gpu_top` is supported for Intel GPUs using the i915 driver, but not the Xe driver. Only one Intel GPU per system is supported with this collector.

### Docker agent {#intel-docker}

Use the `henrygd/beszel-agent-intel` image.

For Xe / Intel Arc, add `pid: host` to enable GPU utilization through `nvtop`:

```yaml
beszel-agent:
  image: henrygd/beszel-agent-intel
  pid: host
  devices:
    - /dev/dri:/dev/dri
```

For `intel_gpu_top` on i915, add `CAP_PERFMON` and expose the GPU device:

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

### Binary agent {#intel-binary}

For `intel_gpu_top` or `nvtop`, install the appropriate tool. `intel_sysfs` does not require either tool.

::: code-group

```bash [Debian / Ubuntu]
sudo apt install intel-gpu-tools
```

```bash [Arch]
sudo pacman -S intel-gpu-tools
```

:::

Assuming you're not running the agent as root, you'll need to set the `cap_perfmon` capability on the `intel_gpu_top` or `nvtop` binary.

```bash
sudo setcap cap_perfmon=ep /usr/bin/intel_gpu_top
sudo setcap cap_perfmon=ep /usr/bin/nvtop
```

If running the agent as a systemd service, [add the `CAP_PERFMON` ambient capability](./environment-variables.md#systemd) to the `beszel-agent` service:

```ini
[Service]
AmbientCapabilities=CAP_PERFMON
```

### Troubleshooting {#intel-troubleshooting}

To independently test the `intel_gpu_top` command:

```bash
# docker
docker exec -it beszel-agent intel_gpu_top -s 3000 -l
# binary
sudo -u beszel intel_gpu_top -s 3000 -l
```

#### Specify the device name

If you have multiple GPUs or `intel_gpu_top` needs a specific device, use the `INTEL_GPU_DEVICE` environment variable.

```dotenv
INTEL_GPU_DEVICE=drm:/dev/dri/card0
```

This is equivalent to running `intel_gpu_top -s 3000 -l -d drm:/dev/dri/card0`.

#### Lower the `perf_event_paranoid` kernel parameter

You may need to lower the value for the `perf_event_paranoid` kernel parameter:

```bash
sudo sysctl kernel.perf_event_paranoid=2
```

See [issue #1150](https://github.com/henrygd/beszel/issues/1150) or [issue #1203](https://github.com/henrygd/beszel/issues/1203) for more information.

To make this change persistant across reboots you can add it to the sysctl configuration:

```bash
echo "kernel.perf_event_paranoid=2" | sudo tee /etc/sysctl.d/99-intel-gpu-beszel.conf
sudo sysctl --system
```

## Apple Silicon (macOS) {#apple}

Apple Silicon GPU monitoring is experimental and requires opt-in by explicitly setting a `GPU_COLLECTOR` value. Feedback is appreciated and can be left in [issue #1746](https://github.com/henrygd/beszel/issues/1746).

### Recommended: `macmon`

`macmon` is recommended as it does not require root privileges. To enable, make sure `macmon` is installed, and set `GPU_COLLECTOR=macmon`.

Also add `PATH="/opt/homebrew/bin:$PATH"` if running as a service to ensure the agent can find it.

```bash
brew install macmon
```

See [vladkens/macmon](https://github.com/vladkens/macmon) for more information about `macmon`.

### `powermetrics`

`powermetrics` is built into macOS but requires the agent to run with `sudo`.

To enable, set `GPU_COLLECTOR=powermetrics`.
