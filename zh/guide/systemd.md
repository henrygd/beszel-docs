# Systemd 服务

Beszel 提供 systemd 服务的基本概览，显示其状态、CPU 使用率、内存消耗和其他指标。这提供了对系统服务健康状况和资源使用的可见性。

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

## 二进制代理

当以二进制方式运行代理时，通常不需要额外的 systemd 监控配置。代理以足够的权限运行来访问 systemd 服务信息。

如果服务没有出现在系统页面上，请检查代理日志中的权限相关错误。

## Docker 代理

挂载系统 D-Bus 套接字以允许代理与 systemd 通信：

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
