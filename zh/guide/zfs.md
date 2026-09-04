# ZFS 监控

当代理可以访问 `zpool` 和 `zfs` 命令行工具时，Beszel 会自动监控 ZFS 存储池。对于每个存储池，它会报告容量、已分配空间、健康状态和 I/O 吞吐量；对于每个数据集，它会报告使用量。

## 要求

`zpool` 和 `zfs` 二进制文件必须已安装，并且代理用户可访问。OpenZFS 已包含在 Proxmox、TrueNAS 以及大多数自带 ZFS 的发行版中。

验证代理用户能否运行它们：

```bash
zpool list
zfs list
```

## Docker 代理

使用包含 ZFS 工具的 `:alpine` 镜像，并将 ZFS 控制设备映射到容器中：

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
  devices:
    - /dev/zfs:/dev/zfs
```

必须映射 `/dev/zfs` — 如果没有它，ZFS 命令无法与内核通信，也不会报告任何存储池数据。

## 二进制代理

二进制代理需要其用户可以在宿主机上访问 `zpool` 和 `zfs`，Proxmox、TrueNAS 以及大多数自带 ZFS 的发行版都提供 OpenZFS。

如果在 systemd 服务中运行代理时未检测到 ZFS 存储池，可能需要显式允许访问 ZFS 控制设备。将以下内容添加到服务配置中：

```ini
[Service]
DeviceAllow=/dev/zfs rw
```

然后重新加载 systemd 并重启代理。

## 显示内容

- **存储池表格** — 显示每个存储池的健康状态、容量、已分配空间和清理（scrub）状态。
- **每池图表** — 显示使用量和 I/O 图表。
- **存储池详情** — 点击存储池可打开面板，显示每个 vdev 的错误计数，以及可排序、可筛选的数据集使用量列表。

## 刷新间隔

存储池的容量、健康状态和 I/O 随常规系统指标一起上报。更详细的数据（清理状态、vdev、数据集）按 `ZFS_INTERVAL`（默认 `1h`）刷新。请参阅[环境变量](./environment-variables)。

## 警报

如果至少配置了一个通知渠道，存储池健康状态变差（例如 `ONLINE` → `DEGRADED`）会自动触发通知。当存储池恢复到 `ONLINE` 时，警报会解除。

请注意，如果存储池在代理首次检测时就已经处于降级状态，则不会触发警报。ZFS 存储池的使用量也会计入磁盘阈值警报。
