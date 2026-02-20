# GPU Monitoring

Beszel can monitor GPU usage, temperature, memory, and power draw for various GPU vendors and platforms.

## Automatic Detection

The agent automatically detects available GPU monitoring tools and selects the best one for your system. You can override this behavior using the `GPU_COLLECTOR` environment variable.

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `GPU_COLLECTOR` | Comma-separated list of collectors to use (e.g., `nvml,amd_sysfs`). |
| `SKIP_GPU` | Set to `true` to disable all GPU monitoring. |

### Available Collectors

- `nvml`: NVIDIA Management Library (experimental).
- `nvidia-smi`: NVIDIA System Management Interface (default).
- `amd_sysfs`: Direct sysfs monitoring for AMD GPUs.
- `rocm-smi`: ROCm System Management Interface (default if installed).
- `intel_gpu_top`: Intel GPU monitoring (default for Intel GPUs).
- `tegrastats`: NVIDIA Jetson monitoring (default for NVIDIA Jetson).
- `nvtop`: Multi-vendor monitoring (cannot be combined with other collectors).
- `macmon`: macOS GPU monitoring (Apple Silicon, experimental).
- `powermetrics`: macOS GPU monitoring (Apple Silicon, requires sudo, experimental).

## NVIDIA GPUs {#nvidia}

Available collectors: `nvidia-smi` (default), `nvml` (experimental), `nvtop`.

### Recommended: NVML

The experimental NVML integration allows GPUs to enter power-saving modes (RTD3) when idle, which `nvidia-smi` may prevent.

To enable, set `GPU_COLLECTOR=nvml`. Feedback is appreciated and can be left in [issue #1746](https://github.com/henrygd/beszel/issues/1746).

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

Available collectors: `intel_gpu_top`, `nvtop`.

Note that only one Intel GPU per system is supported.

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

### Binary agent {#intel-binary}

You must have `intel_gpu_top` or `nvtop` installed.

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

`macmon` is recommended as it does not require root privileges. You must have `macmon` installed and available in your `PATH`.

To enable, make sure `macmon` is installed, and set `GPU_COLLECTOR=macmon`.

```bash
brew install macmon
```

See [vladkens/macmon](https://github.com/vladkens/macmon) for more information about `macmon`.

### `powermetrics`

`powermetrics` is built into macOS but requires the agent to run with `sudo`.

To enable, set `GPU_COLLECTOR=powermetrics`.