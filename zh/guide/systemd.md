# Systemd 服务

Beszel 提供 systemd 服务的基本概览，显示其状态、CPU 使用率、内存消耗和其他指标。这提供了对系统服务健康状况和资源使用的可见性。

## 二进制代理

当以二进制方式运行代理时，通常不需要额外的 systemd 监控配置。代理以足够的权限运行来访问 systemd 服务信息。

如果服务没有出现在系统页面上，请检查代理日志中的权限相关错误。

## Docker 代理

挂载系统 D-Bus 套接字以允许代理与 systemd 通信：

::: tip
无根 Docker / Podman 可能无法访问系统 D-Bus 套接字。请改用二进制代理。
:::

```yaml
services:
  beszel-agent:
    volumes:
      - /var/run/dbus/system_bus_socket:/var/run/dbus/system_bus_socket:ro
```

如果日志显示 AppArmor 错误，请添加以下安全选项：

```yaml
services:
  beszel-agent:
    security_opt:
      - apparmor:unconfined
```

如果服务仍然没有出现，请尝试同时挂载 systemd 私有套接字：

```yaml
services:
  beszel-agent:
    volumes:
      - /var/run/systemd/private:/var/run/systemd/private:ro
```

作为最后的手段，您可以使用特权访问运行容器。这对于测试很有用，但不建议用于生产环境。

```yaml
services:
  beszel-agent:
    privileged: true
```

<!-- ## 用户服务 vs 系统服务

Systemd 支持系统级服务和用户特定服务：

- **系统服务**：以 root 或专用系统用户身份运行，由 `systemctl` 管理
- **用户服务**：按用户运行，由 `systemctl --user` 管理

代理默认监控系统服务。用户服务需要额外配置，通常需要代理作为目标用户运行。 -->


## 显示内容

代理收集至少运行过一次的 systemd 服务的数据（包括失败或退出的服务），包括：

- 服务状态（活动、不活动、失败等）
- CPU 和内存使用率
- 重启计数
- 单元文件状态和描述
- 生命周期（变为活动、变为不活动等）

说明：

- 峰值内存使用率涵盖服务的整个生命周期（如果 systemd 提供）。否则，它是监控期间的最大内存使用率。
- 服务在首次连接时将显示 0% CPU 使用率。这是正常行为 - CPU 使用率将在下一次更新周期正确填充。

## 警报

启用 **Failed Services**（故障服务）警报（系统上的铃铛图标，或**所有系统**选项卡），以便在任何受跟踪的服务进入 `failed` 状态时收到通知，并在之前所有发生故障的服务恢复后再次收到通知。通知中会指明受影响的服务名称，例如 "2 failed services on web01: nginx, fail2ban"。

此警报是系统维度的——它会在任何服务发生故障时触发，无法单独选择特定服务。具体跟踪哪些服务完全由 `SERVICE_PATTERNS` 控制（请参阅 [环境变量](./environment-variables.md#service_patterns)）；服务必须匹配这些模式之一才能够触发警报。

与 CPU、内存等警报不同，此警报没有延迟/持续时间设置。一旦检测到故障服务就会立即触发。代理每 10 分钟仅刷新一次 systemd 状态，因此故障可能需要长达 10 分钟左右才会被察觉——重启代理会强制立即刷新。由于存在此轮询间隔，能够迅速自愈的瞬态故障通常不会被检测到。

## 服务日志

点击某个服务，即可在服务详情上方查看其最近的日志条目（来自 systemd 日志的最后 200 行）。使用日志上方的按钮可以刷新日志或全屏查看。

代理只会返回其所监控服务的日志。使用 [`SERVICE_PATTERNS`](./environment-variables.md#service_patterns) 控制监控哪些服务。

如果代理无法读取系统日志，或者通过 [`SKIP_SYSTEMD_LOGS`](./environment-variables.md#skip_systemd_logs) 禁用了日志，日志面板将被隐藏。

::: warning 日志可能包含敏感信息
所有能够在 Beszel 中查看该系统的用户（包括只读用户）都可以读取其服务日志。
:::

### 日志访问权限 { #journal-access }

代理使用 `journalctl` 读取日志，因此需要读取系统日志的权限。代理在启动时检查访问权限，因此更改权限后请重启代理。

如果您使用安装脚本安装代理，脚本会将 `SupplementaryGroups=systemd-journal` 添加到 `beszel-agent` 服务中。这样代理服务即可读取日志，而无需将 `beszel` 用户添加到该组。对于现有安装，重新运行安装脚本即可添加此设置。

如需手动设置，请运行 `sudo systemctl edit beszel-agent` 并添加：

```ini
[Service]
SupplementaryGroups=systemd-journal
```

然后重启代理：

```bash
sudo systemctl restart beszel-agent
```

以 root 身份运行的代理已经可以读取日志。

官方 Docker 镜像不包含 `journalctl`，因此服务日志仅适用于二进制代理。

### 禁用日志

设置 `SKIP_SYSTEMD_LOGS=true` 可禁止代理提供日志。

您也可以运行 `sudo systemctl edit beszel-agent` 并添加一个空的 `SupplementaryGroups=` 来移除代理的日志访问权限。重新运行安装脚本时会保留此覆盖设置。

```ini
[Service]
SupplementaryGroups=
```

## 故障排除

### 服务未出现

1. 检查代理日志以查找权限或连接错误
2. 验证 systemd 可访问性：

   ```bash
   dbus-send --system --dest=org.freedesktop.systemd1 --type=method_call --print-reply /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager.ListUnits
   ```

3. 检查 systemd 版本兼容性（需要 systemd 243+ 才能获得 `ListUnitsByPatterns` 方法支持）：

   ```bash
   systemctl --version
   ```

4. 验证代理权限以访问 systemd 服务

### 日志未显示

1. 确保代理和 Hub 均已更新到最新版本。
2. 对于二进制代理，请检查服务是否具有日志访问权限。输出应为 `SupplementaryGroups=systemd-journal`：

   ```bash
   systemctl show beszel-agent -p SupplementaryGroups
   ```

   如果为空，请参阅 [日志访问权限](#journal-access)。

3. 更改权限后重启代理。日志访问权限仅在代理启动时检查。
4. 确保 `SKIP_SYSTEMD_LOGS` 未设置为 `true`。

### 缺少内存统计信息

如果您发现运行中的服务缺少内存统计信息，您的操作系统提供商可能已禁用 cgroup 内存记账。这在 Raspberry Pi 上很常见。

启用 cgroup 内存记账非常简单。可以在 [GitHub 讨论 #1433](https://github.com/henrygd/beszel/discussions/1433) 中找到说明，或参考以下指南：

https://akashrajpurohit.com/blog/resolving-missing-memory-stats-in-docker-stats-on-raspberry-pi/

### 常见错误

常见错误消息和解决方案：

#### `An AppArmor policy prevents this sender from sending this message to this recipient` { #apparmor-error }

将以下内容添加到您的 `docker-compose.yml`：

```yaml
services:
  beszel-agent:
    security_opt:
      - apparmor:unconfined
```

#### `Unknown method 'ListUnitsByPatterns'`

systemd < 243 不支持此方法。升级到 systemd 243 或更高版本。

## 兼容性

**Systemd 版本**：需要 systemd 243+ 才能获得 `ListUnitsByPatterns` 方法支持
