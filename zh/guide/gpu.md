# GPU 监控

Beszel 可以监控各种 GPU 厂商和平台的 GPU 使用率、温度、内存和功耗。

## 自动检测

Agent 会自动检测可用的 GPU 监控工具并为您的系统选择最佳工具。您可以使用 `GPU_COLLECTOR` 环境变量覆盖此行为。

## 环境变量

| 变量 | 描述 |
| :--- | :--- |
| `GPU_COLLECTOR` | 要使用的收集器列表，以逗号分隔（例如 `nvml,amd_sysfs`）。 |
| `SKIP_GPU` | 设置为 `true` 以禁用所有 GPU 监控。 |

### 可用收集器

- `nvml`: NVIDIA 管理库（实验性）。
- `nvidia-smi`: NVIDIA 系统管理界面（默认）。
- `amd_sysfs`: 通过 sysfs 直接监控 AMD GPU。
- `rocm-smi`: ROCm 系统管理界面（如果已安装则为默认）。
- `intel_gpu_top`: Intel GPU 监控（Intel GPU 的默认设置）。
- `tegrastats`: NVIDIA Jetson 监控（NVIDIA Jetson 的默认设置）。
- `nvtop`: 多厂商监控（不能与其他收集器结合使用）。
- `macmon`: macOS GPU 监控（Apple Silicon，实验性）。
- `powermetrics`: macOS GPU 监控（Apple Silicon，需要 sudo，实验性）。

## NVIDIA GPU {#nvidia}

### 推荐：NVML

实验性的 NVML 集成允许 GPU 在空闲时进入省电模式 (RTD3)，而 `nvidia-smi` 可能会阻止这种情况。

要启用，请设置 `GPU_COLLECTOR=nvml`。欢迎在 [issue #1746](https://github.com/henrygd/beszel/issues/1746) 中提供反馈。

### Docker Agent

确保主机系统上已安装 NVIDIA Container Toolkit。

使用 `henrygd/beszel-agent-nvidia` 并在您的 `docker-compose.yml` 中添加以下 `deploy` 块。

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

### 二进制 Agent {#nvidia-binary}

您必须在系统上安装 `nvidia-smi` 或 NVIDIA 驱动程序。

如果使用 `nvidia-smi` 且无法正常工作，您可能需要在服务配置中允许访问您的设备。有关更多信息，请参阅 [discussion #563](https://github.com/henrygd/beszel/discussions/563#discussioncomment-12230389)。

```ini
[Service]
DeviceAllow=/dev/nvidiactl rw
DeviceAllow=/dev/nvidia0 rw
# 如果您有多个 GPU，请确保允许所有 GPU
DeviceAllow=/dev/nvidia1 rw
DeviceAllow=/dev/nvidia2 rw
```

```bash
systemctl daemon-reload
systemctl restart beszel-agent
```

## NVIDIA Jetson {#nvidia-jetson}

二进制 Agent 应该会自动使用 `tegrastats` 工作。

### Docker Agent

Docker Agent 需要自定义镜像和 `tegrastats` 的绑定挂载。

#### 1. 创建自定义 Dockerfile

在 `docker-compose.yml` 所在的目录中创建一个 `Dockerfile`：

```dockerfile
FROM frolvlad/alpine-glibc:latest

COPY --from=henrygd/beszel-agent:latest /agent /agent
RUN chmod +x /agent

ENTRYPOINT ["/agent"]
```

#### 2. 更新 Docker Compose

更新您的 `docker-compose.yml` 以使用您的自定义镜像，并绑定挂载 `tegrastats`：

```yaml
beszel-agent:
  build: .
  volumes:
    - /usr/bin/tegrastats:/usr/bin/tegrastats:ro
```

有关更多信息，请参阅 [discussion #1600](https://github.com/henrygd/beszel/discussions/1600)。

## AMD GPU {#amd}

### 推荐：`amd_sysfs` (Linux)

Beszel 可以通过 sysfs 直接监控 AMD GPU，这比 `rocm-smi` 更高效。

如果您安装了 `rocm-smi` 但想使用 sysfs，请设置 `GPU_COLLECTOR=amd_sysfs`。

### `rocm-smi` (已弃用)

Beszel 也可以使用 `rocm-smi` 来监控 AMD GPU。这必须在系统上可用。请注意，`rocm-smi` 已弃用，可能会在未来的版本中删除。

如果 `rocm-smi` 不在运行 `beszel-agent` 的用户的 `PATH` 中，请将其符号链接到 `/usr/local/bin`：

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Intel GPU {#intel}

请注意，每个系统仅支持一个 Intel GPU。

### Docker Agent {#intel-docker}

使用 `henrygd/beszel-agent-intel` 镜像并添加以下额外选项。

```yaml
beszel-agent:
  image: henrygd/beszel-agent-intel
  cap_add:
    - CAP_PERFMON
  devices:
    - /dev/dri/card0:/dev/dri/card0
```

使用 `ls /dev/dri` 查找您的 GPU 名称：

```bash
ls /dev/dri
```

### 二进制 Agent {#intel-binary}

您必须安装 `intel_gpu_top` 或 `nvtop`。

::: code-group

```bash [Debian / Ubuntu]
sudo apt install intel-gpu-tools
```

```bash [Arch]
sudo pacman -S intel-gpu-tools
```

:::

假设您不以 root 身份运行 Agent，则需要为 `intel_gpu_top` 或 `nvtop` 二进制文件设置 `cap_perfmon` 能力。

```bash
sudo setcap cap_perfmon=ep /usr/bin/intel_gpu_top
sudo setcap cap_perfmon=ep /usr/bin/nvtop
```

如果将 Agent 作为 systemd 服务运行，请将 [`CAP_PERFMON` 环境能力](./environment-variables.md#systemd)添加到 `beszel-agent` 服务：

```ini
[Service]
AmbientCapabilities=CAP_PERFMON
```

### 故障排除 {#intel-troubleshooting}

独立测试 `intel_gpu_top` 命令：

```bash
# docker
docker exec -it beszel-agent intel_gpu_top -s 3000 -l
# binary
sudo -u beszel intel_gpu_top -s 3000 -l
```

#### 指定设备名称

如果您有多个 GPU 或 `intel_gpu_top` 需要特定设备，请使用 `INTEL_GPU_DEVICE` 环境变量。

```dotenv
INTEL_GPU_DEVICE=drm:/dev/dri/card0
```

这相当于运行 `intel_gpu_top -s 3000 -l -d drm:/dev/dri/card0`。

#### 降低 `perf_event_paranoid` 内核参数

您可能需要降低 `perf_event_paranoid` 内核参数的值：

```bash
sudo sysctl kernel.perf_event_paranoid=2
```

有关更多信息，请参阅 [issue #1150](https://github.com/henrygd/beszel/issues/1150) 或 [issue #1203](https://github.com/henrygd/beszel/issues/1203)。

要使此更改在重启后保持有效，您可以将其添加到 sysctl 配置中：

```bash
echo "kernel.perf_event_paranoid=2" | sudo tee /etc/sysctl.d/99-intel-gpu-beszel.conf
sudo sysctl --system
```

## Apple Silicon (macOS) {#apple}

Apple Silicon GPU 监控是实验性的，需要通过显式设置 `GPU_COLLECTOR` 值来启用。欢迎在 [issue #1746](https://github.com/henrygd/beszel/issues/1746) 中提供反馈。

### 推荐：`macmon`

推荐使用 `macmon`，因为它不需要 root 权限。您必须安装 `macmon` 并在 `PATH` 中可用。

要启用，请确保已安装 `macmon`，并设置 `GPU_COLLECTOR=macmon`。

```bash
brew install macmon
```

有关 `macmon` 的更多信息，请参阅 [vladkens/macmon](https://github.com/vladkens/macmon)。

### `powermetrics`

`powermetrics` 内置于 macOS 中，但需要 Agent 以 `sudo` 运行。

要启用，请设置 `GPU_COLLECTOR=powermetrics`。
