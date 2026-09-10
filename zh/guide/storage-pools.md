# 存储池

Beszel 会监控 ZFS 存储池和 Btrfs 文件系统，报告容量、用量、健康状态和 I/O 吞吐量。ZFS 监控还包括 scrub 状态和数据集用量。

## ZFS

代理需要访问 `zpool` 和 `zfs` 命令行工具。OpenZFS 提供了这些工具。

要验证代理用户可以运行它们：

```bash
zpool list
zfs list
```

### Docker 代理

使用包含 ZFS 工具的 `:alpine` 镜像，并将 ZFS 控制设备映射到容器中：

```yaml
beszel-agent:
  image: henrygd/beszel-agent:alpine
  devices:
    - /dev/zfs:/dev/zfs
```

必须映射 `/dev/zfs`，ZFS 命令才能与内核通信。

### 二进制代理

在主机上安装 ZFS 工具，并确保代理用户可以访问它们。

如果以 systemd 服务方式运行代理时未检测到 ZFS 存储池，您可能需要允许访问 ZFS 控制设备：

```ini
[Service]
DeviceAllow=/dev/zfs rw
```

更新服务后，重新加载 systemd 并重启代理。

## Btrfs

在 Linux 上，代理会通过 `/sys/fs/btrfs` 自动发现 Btrfs 文件系统。不需要 Btrfs 命令行工具或特殊的代理镜像。

每个文件系统都会显示为一个存储池，包括跨多个设备的单个文件系统。代理会报告成员设备的错误计数器，当有设备缺失时会将文件系统标记为 `DEGRADED`。目前不报告 Btrfs scrub 状态和子卷用量。

### Docker 代理

只要代理能够读取主机的 Btrfs sysfs 信息，无需额外的文件夹挂载即可报告 Btrfs 存储池。

对于调整过大小的文件系统，为了准确报告容量，请在该文件系统上创建一个目录，并以只读方式绑定挂载到代理中：

```yaml
beszel-agent:
  image: henrygd/beszel-agent
  volumes:
    - /mnt/storage/.beszel:/extra-filesystems/storage:ro
```

每个 Btrfs 文件系统只需要一个可访问的文件夹，多设备 RAID 文件系统也是如此。现有的 `/extra-filesystems` 挂载也可以提供此访问。代理用户必须能够访问该目录。

如果容量查询失败，该存储池仍会继续报告，使用 sysfs 上报的后端设备大小（在界面中标注为 "raw"）。

### 二进制代理

代理需要对 Btrfs sysfs 信息的读取权限。为了报告记录容量，其用户还必须能够打开已挂载文件系统上的路径。

### 容量报告

代理优先使用 Btrfs 记录的成员设备容量，通过可访问的文件系统挂载点进行查询。如果查询不可用或失败，则会回退到 sysfs 上报的后端设备大小。

当 Btrfs 文件系统被缩小，而其底层分区或设备未同步缩小时，回退方式可能会高估容量、低估用量百分比。

### 旧版内核

当设备健康信息不可用时，健康状态为 **UNKNOWN**。设备详情取决于内核支持：`devinfo` 自 Linux 5.6 起可用，错误计数器自 Linux 5.14 起可用。

## 显示内容

- **存储池表格** — 每个存储池的健康状态、容量和用量，ZFS 还包括 scrub 状态。
- **单存储池图表** — 用量和 I/O 吞吐量。
- **存储池详情** — 设备错误计数器；ZFS 存储池还包括可排序、可筛选的数据集用量列表。

## 刷新间隔

存储池指标包含在常规系统更新中。容量大约每分钟刷新一次，健康状态和 I/O 则随常规更新采样。

详细的存储池信息按 `ZFS_INTERVAL`（默认为 `1h`）刷新。尽管名称如此，该设置同时适用于 ZFS 和 Btrfs 存储池详情。请参阅[环境变量](./environment-variables)。

## 警报

如果配置了至少一个通知渠道，当存储池健康状态变为更差的状态时（例如 `ONLINE` → `DEGRADED`），会自动触发通知。当存储池恢复为 `ONLINE` 时，警报会被解除。

如果存储池在首次被检测到时就已经处于降级状态，则不会触发健康变化警报。ZFS 和 Btrfs 存储池用量都包含在磁盘阈值警报中。
