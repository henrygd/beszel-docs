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

您必须使用二进制代理并安装 `tegrastats`。

`henrygd/beszel-agent-nvidia` 镜像可能不起作用，但我无法测试以确认。如果您尝试了，请告诉我结果如何 :)。

## Intel GPU {#intel}

Intel 支持是新的，仍在解决一些问题。

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

如果不起作用，您可能需要为 `perf_event_paranoid` 内核参数设置一个较低的值。有关更多信息，请参阅 [issue #1150](https://github.com/henrygd/beszel/issues/1150) 或 [#1203](https://github.com/henrygd/beszel/issues/1203#issuecomment-3336457430)。

```bash
sudo sysctl kernel.perf_event_paranoid=2
```

如果以上方法都不起作用，请尝试在 `CAP_PERFMON` 之外添加 `CAP_SYS_ADMIN` 和 `CAP_DAC_OVERRIDE`。

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

如果不起作用，您可能需要为 `perf_event_paranoid` 内核参数设置一个较低的值。有关更多信息，请参阅 [issue #1150](https://github.com/henrygd/beszel/issues/1150) 或 [#1203](https://github.com/henrygd/beszel/issues/1203#issuecomment-3336457430)。

```bash
sudo sysctl kernel.perf_event_paranoid=2
```
