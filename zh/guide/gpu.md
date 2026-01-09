# GPU 监控

Beszel 可以监控 GPU 使用率、温度和功耗。

## AMD GPU {#amd}

::: info 正在开发中
AMD 已弃用 `rocm-smi`，转而使用 `amd-smi`。代理在 Linux 上可以与 `rocm-smi` 配合使用，但尚未更新以支持 `amd-smi`。
:::

Beszel 使用 `rocm-smi` 监控 AMD GPU。该工具必须在系统上可用，并且您必须使用二进制代理（而不是 Docker 代理）。

#### 确保可以访问 `rocm-smi`

在 Arch 和 Debian 上安装 `rocm-smi-lib` 会将 `rocm-smi` 二进制文件放置在 `/opt/rocm` 中。如果该目录不在运行 `beszel-agent` 的用户的 `PATH` 环境变量中，请将其符号链接到 `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Nvidia GPU {#nvidia}

::: warning 功耗警告
`nvidia-smi` 会阻止 GPU 进入 RTD3 节能模式，这可能导致笔记本电脑的功耗增加。

我们正在开发解决方案。有关更多信息，请参阅 [issue #1522](https://github.com/henrygd/beszel/issues/1522)。
:::

### Docker 代理 {#nvidia-docker}

确保主机系统上安装了 NVIDIA Container Toolkit。

使用 `henrygd/beszel-agent-nvidia` 并将以下 `deploy` 块添加到您的 `docker-compose.yml` 中。

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

### 二进制代理 {#nvidia-binary}

您必须在系统上有 `nvidia-smi` 可用。

如果不起作用，您可能需要在服务配置中允许访问您的设备。有关更多信息，请参阅 [discussion #563](https://github.com/henrygd/beszel/discussions/563#discussioncomment-12230389)。

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

## Nvidia Jetson {#nvidia-jetson}

二进制代理应自动工作，无需额外配置。

### Docker 代理

Docker 代理需要自定义镜像和 `tegrastats` 的绑定挂载。

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
  image: henrygd/beszel-agent # [!code --]
  build: . # [!code ++]
  volumes:
    - /usr/bin/tegrastats:/usr/bin/tegrastats:ro
```

有关更多信息，请参阅[讨论 #1600](https://github.com/henrygd/beszel/discussions/1600)。

## Intel GPU {#intel}

请注意，目前每个系统仅支持一个 GPU。我们可能会在未来添加对多个 GPU 的支持。

### Docker 代理 {#intel-docker}

使用 `henrygd/beszel-agent-intel` 镜像并添加以下附加选项。

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

```
by-path  card0  renderD128
```

### 二进制代理 {#intel-binary}

您必须安装 `intel_gpu_top`。这通常是 `intel-gpu-tools` 包的一部分。

::: code-group

```bash [Debian / Ubuntu]
sudo apt install intel-gpu-tools
```

```bash [Arch]
sudo pacman -S intel-gpu-tools
```

:::

假设您不是以 root 身份运行代理，您需要在 `intel_gpu_top` 二进制文件上设置 `cap_perfmon` 能力。

```bash
sudo setcap cap_perfmon=ep /usr/bin/intel_gpu_top
```

如果将代理作为 systemd 服务运行，请[在 `beszel-agent` 服务中添加 `CAP_PERFMON` 环境能力](./environment-variables.md#systemd)，这样以非 root 用户运行的服务仍然可以访问性能计数器：

```ini
[Service]
AmbientCapabilities=CAP_PERFMON
```

这是必需的，因为当使用非 root 用户运行服务时，通过 `setcap` 设置在 `intel_gpu_top` 可执行文件上的文件能力不会被子进程继承。有关更多背景信息，请参阅 [issue #1480](https://github.com/henrygd/beszel/issues/1480)。


### 故障排除 {#intel-troubleshooting}

要独立测试 `intel_gpu_top` 命令：

```bash
# docker
docker exec -it beszel-agent intel_gpu_top -s 3000 -l
# binary
sudo -u beszel intel_gpu_top -s 3000 -l
```

#### 指定设备名称

在某些系统上，您需要为 `intel_gpu_top` 指定设备名称。使用 `INTEL_GPU_DEVICE` 环境变量来设置 `-d` 值。

```dotenv
INTEL_GPU_DEVICE=drm:/dev/dri/card0
```

这相当于运行 `intel_gpu_top -s 3000 -l -d drm:/dev/dri/card0`。

#### 降低 `perf_event_paranoid` 内核参数

您可能需要降低 `perf_event_paranoid` 内核参数的值。有关更多信息，请参阅 [issue #1150](https://github.com/henrygd/beszel/issues/1150) 或 [#1203](https://github.com/henrygd/beszel/issues/1203#issuecomment-3336457430)。

```bash
sudo sysctl kernel.perf_event_paranoid=2
```

要让此更改在重启后依然生效，需要将其添加到 `sysctl` 配置中。

```bash
echo "kernel.perf_event_paranoid=2" | sudo tee /etc/sysctl.d/99-intel-gpu-beszel.conf
sudo sysctl --system
```