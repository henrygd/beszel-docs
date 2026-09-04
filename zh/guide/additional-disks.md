# 其他磁盘

您可以使用 Beszel 监控磁盘、分区或远程挂载。

图表将使用设备或分区的名称（如果可用），否则将回退到目录名。您将无法获得网络挂载驱动器的 I/O 统计信息。

::: tip ZFS
ZFS 存储池和数据集会自动监控 — 无需将它们添加到 `EXTRA_FILESYSTEMS`。如果您确实添加了 ZFS 挂载点，其使用量将从 `zfs list` 报告（与存储池一致），而不是挂载的文件系统，并且不会显示 diskstats I/O 警告。请参阅 [ZFS 监控](./zfs)。
:::

::: tip 查找设备信息
使用 `lsblk -o NAME,KNAME,SIZE,TYPE,MOUNTPOINT` 查找分区的名称和挂载点。请务必使用设备的内核名称（KNAME），而不是设备映射器报告的名称（NAME）。这可以解决加密设备或逻辑卷 I/O 统计信息报告异常的问题。

如果遇到问题，请在代理上设置 `LOG_LEVEL=debug` 并检查日志中以 `DEBUG Disk partitions` 和 `DEBUG Disk I/O diskstats` 开头的行。

:::
配置会根据您的部署方式而异。

## 根磁盘

设置 `FILESYSTEM` 环境变量可覆盖用于根磁盘统计信息的设备、分区或挂载点。

您也可以在双下划线后添加自定义显示名称。例如，`FILESYSTEM=sda__OS` 会使用 `sda` 获取根磁盘统计信息，并在界面中将该磁盘显示为“OS”。

## Docker 代理

在容器的 `/extra-filesystems` 目录中挂载目标文件系统中的文件夹：

```yaml
volumes:
  - /mnt/disk1/.beszel:/extra-filesystems/sdb1:ro
  # 给设备指定自定义名称
  - /mnt/media/.beszel:/extra-filesystems/sdc1__Media:ro
```

::: tip 提示
如果您可以看到磁盘使用情况但看不到 I/O（加密设备常见），您可以使用挂载目录名指定用于 I/O 的设备。这应该是 `/proc/diskstats` 中的条目。有关详细信息，请参阅 [0.7.3 发布说明](https://github.com/henrygd/beszel/releases/tag/v0.7.3)。
:::

## 二进制代理

将 `EXTRA_FILESYSTEMS` 环境变量设置为要监视的设备、分区或挂载点的逗号分隔列表。例如：

::: code-group

```bash [bash]
EXTRA_FILESYSTEMS="sdb,sdc1,mmcblk0,/mnt/network-share" KEY="..." ./beszel-agent
```

```ini [beszel-agent.service]
[Unit]
RequiresMountsFor=/mnt/ssd /mnt/media

[Service]
Environment="EXTRA_FILESYSTEMS=sdb,sdc1,mmcblk0,/mnt/network-share"
```

:::

如果使用 Systemd，服务配置文件通常位于 `/etc/systemd/system/beszel-agent.service`。

`RequiresMountsFor=` 会让 systemd 在启动代理前等待这些挂载点。如果其中一个挂载失败，服务就无法启动。

因为代理在挂载不可用时仍应运行，默认情况下更安全的做法是省略 `RequiresMountsFor=`，让代理自己监控路径。若要控制启动顺序，优先使用 `After=mnt-ssd.mount`，而不是 `RequiresMountsFor=`。

编辑服务后，使用 `systemctl daemon-reload` 重新加载系统单元，然后使用 `systemctl restart beszel-agent` 重启服务。

::: tip 自定义名称
您可以使用双下划线为设备指定自定义名称。例如，`sdc1__Jellyfin Media`。这将在图表中使用"Jellyfin Media"作为设备名称。
:::

## Windows 代理

将 `EXTRA_FILESYSTEMS` 环境变量设置为要监视的驱动器号（以逗号分隔）。例如：

```dotenv
EXTRA_FILESYSTEMS="D:,E:,F:"
```

以下说明假设您使用 NSSM 将代理作为 Windows 服务运行。

### CLI

```powershell
nssm set beszel-agent AppEnvironmentExtra "+EXTRA_FILESYSTEMS=D:,E:,F:"
```

### GUI

```powershell
nssm edit beszel-agent
```

转到 **Environment** 选项卡并添加变量：

```
EXTRA_FILESYSTEMS=D:,E:,F:
```

点击 **Edit service**，然后重启服务以应用更改：

```powershell
nssm restart beszel-agent
```
