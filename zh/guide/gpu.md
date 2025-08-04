# GPU 监控

Beszel 可以监控 GPU 使用率、温度和功耗。

## AMD GPU

::: info 正在开发中
AMD 已弃用 `rocm-smi`，转而使用 `amd-smi`。代理在 Linux 上可以与 `rocm-smi` 配合使用，但尚未更新以支持 `amd-smi`。
:::

Beszel 使用 `rocm-smi` 监控 AMD GPU。该工具必须在系统上可用，并且您必须使用二进制代理（而不是 Docker 代理）。

#### 确保可以访问 `rocm-smi`

在 Arch 和 Debian 上安装 `rocm-smi-lib` 会将 `rocm-smi` 二进制文件放置在 `/opt/rocm` 中。如果该目录不在运行 `beszel-agent` 的用户的 `PATH` 环境变量中，请将其符号链接到 `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Nvidia GPU

### Docker 代理

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

### 二进制代理

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

## Nvidia Jetson

您必须使用二进制代理并安装 `tegrastats`。

`henrygd/beszel-agent-nvidia` 镜像可能不起作用，但我无法测试以确认。如果您尝试了，请告诉我结果如何 :)。

## Intel GPU

由于以下原因，目前不支持英特尔显卡：似乎没有像 `nvidia-smi` 这样可以直接获取利用率和内存使用情况的简单工具。

我们可能会在未来添加使用 `intel-gpu-top` 跟踪视频和 3D 渲染引擎使用情况的支持。

有关更多信息，请参阅 [issue #262](https://github.com/henrygd/beszel/issues/262)。
