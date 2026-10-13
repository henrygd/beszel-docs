# 软件包更新

Beszel 会在系统表格的 **更新** 列中显示每个 Linux 系统待安装的软件包更新数量。系统页面会列出每个软件包的当前版本和可用版本。

数量旁边的圆点表示状态：

- 红色：至少有一个待安装的安全更新。
- 黄色：有待安装的更新，但都不是安全更新。
- 绿色：系统已是最新。

## 工作原理

代理会检测系统的包管理器，并查询哪些软件包可以升级。检查在后台运行，因此不会延迟其他指标的采集。

默认每小时检查一次。将 [`PACKAGE_UPDATES_INTERVAL`](./environment-variables) 设置为 `30m` 或 `6h` 等时长可更改检查间隔，设置为 `0` 则禁用软件包更新检查。

代理不会安装软件包。大多数包管理器使用系统已有的元数据，但 Arch 和 Void 会至多每 12 小时刷新一次仓库元数据。Arch 使用 `checkupdates` 维护单独的软件包数据库，Void 则使用 `xbps-install -Mun`。

只有 Linux 上的二进制代理会检查软件包更新。Docker 代理会跳过检查，因为容器内的软件包并不是主机的软件包。

## 支持的发行版

| 发行版 | 包管理器 | 安全更新 | 元数据刷新方式 |
| --- | --- | --- | --- |
| Debian、Ubuntu | apt | 按软件包标记 | `apt-daily.timer`（默认启用）或 `apt update` |
| Fedora、RHEL、Rocky、Alma | dnf | 按软件包标记 | `dnf-makecache.timer` 或 `dnf makecache` |
| openSUSE、SLES | zypper | 仅数量 | `zypper refresh` |
| Arch 及其衍生版 | checkupdates (pacman-contrib) | 不支持 | `checkupdates`（每 12 小时） |
| Alpine | apk | 不支持 | `apk update` |
| Void Linux | xbps | 不支持 | `xbps-install -Mun`（每 12 小时） |

### Debian 和 Ubuntu

更新来自模拟升级（`apt-get -s dist-upgrade`）。来自 `-security` 仓库的软件包会被标记为安全更新。

必须定期刷新 APT 软件包列表，更新才会显示。请确保已启用 `apt-daily.timer` 并配置了自动更新软件包列表，或定期运行 `apt update`。

### Fedora、RHEL、Rocky 和 Alma

更新来自基于本地元数据缓存的 `dnf check-update`。安全更新根据仓库的安全公告进行标记。

`dnf-makecache.timer` 会保持缓存为最新，但在精简镜像或容器镜像中可能被禁用。如果始终没有显示任何更新，请使用 `systemctl status dnf-makecache.timer` 检查。

在基于 RHEL 的发行版（dnf4）上，代理服务需要可写的 `/var/tmp`。请参阅 [Systemd 服务](#systemd-service)。

### openSUSE 和 SLES

更新来自 `zypper list-updates`。安全补丁会被计数，但 zypper 不会将其关联到具体软件包，因此系统页面上的列表没有安全标记。

代理服务需要可写的 `/var/tmp`。请参阅 [Systemd 服务](#systemd-service)。

### Arch

更新通过 `pacman-contrib` 软件包中的 `checkupdates` 检查，该软件包必须已安装。

`checkupdates` 会维护一份单独的软件包同步数据库副本，因此 Beszel 可以在不修改系统软件包数据库、也不安装任何软件包的情况下检测可用更新。

代理至多每 12 小时刷新一次这份单独的数据库，两次刷新之间的检查使用缓存数据。Arch 不支持安全更新分类。

### Alpine

更新来自基于本地软件包索引的 `apk -u list`，该索引由 `apk update` 刷新。

## Systemd 服务 {#systemd-service}

安装脚本以 `beszel` 用户运行代理，并启用 `ProtectSystem=strict`，这会使大部分文件系统变为只读。基于 RHEL 的发行版上的 dnf 以及 zypper 需要向 `/var/tmp` 写入临时文件，因此服务需要 `PrivateTmp=yes`：

```ini
[Service]
PrivateTmp=yes
```

安装脚本会为新安装添加此设置。对于现有安装，请重新运行安装脚本，或使用 `systemctl edit beszel-agent` 添加此设置，然后重启代理。

### Void Linux

更新通过 `xbps-install -Mun` 检查，它会刷新仓库元数据并模拟升级，而不会安装任何软件包。已安装的版本通过 `xbps-query -l` 获取。

代理至多每 12 小时刷新一次仓库元数据。两次刷新之间的检查会重用缓存的更新列表，并排除此后已升级或已移除的软件包。

Void Linux 不支持安全更新分类。

## 故障排除

如果 **更新** 列始终为空，请设置 `LOG_LEVEL=debug` 并查看代理日志：

```bash
journalctl -u beszel-agent | grep -i "package updates"
```

- `Package updates manager=...` 表示已检测到包管理器。如果没有这一行，说明该发行版不受支持，或代理运行在容器中。
- `Package updates check failed err=...` 包含包管理器返回的错误。

要以与代理服务相同的方式运行检查，请使用 `systemd-run`。例如，在使用 dnf 的系统上：

```bash
sudo systemd-run --pipe --wait -p User=beszel -p ProtectSystem=strict -p ProtectHome=read-only -p PrivateTmp=yes \
  dnf -q -C check-update
```

退出码 `100` 表示有可用更新，`0` 表示没有更新。其他任何退出码都表示出错，输出内容会说明原因。
