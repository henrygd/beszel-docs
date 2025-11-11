# Systemd 服务

Beszel 提供 systemd 服务的基本概览，显示其状态、CPU 使用率、内存消耗和其他指标。这提供了对系统服务健康状况和资源使用的可见性。

## 显示内容

代理收集至少运行过一次的 systemd 服务的数据（包括失败或退出的服务），显示：

- 服务状态（活动、不活动、失败等）
- CPU 和内存使用率
- 重启计数
- 服务启动/停止时间
- 单元文件状态和描述
- 生命周期（变为活动、变为不活动等）

说明：

- 峰值内存使用率涵盖服务的整个生命周期（如果 systemd 提供）。否则，它是监控期间的最大内存使用率。
- 服务在首次连接时将显示 0% CPU 使用率。这是正常行为 - CPU 使用率将在下一次更新周期正确填充。

## 二进制代理

当以二进制方式运行代理时，通常不需要额外的 systemd 监控配置。代理以足够的权限运行来访问 systemd 服务信息。

如果服务没有出现在系统页面上，请检查代理日志中的权限相关错误。

## Docker 代理

根据您的安全要求和系统配置，有几种方法可用。如果您知道此处未列出的其他方法，请告诉我们。

### 方法 1：系统总线套接字

挂载系统 D-Bus 套接字以允许代理与 systemd 通信：

```yaml
services:
  beszel-agent:
    volumes:
      - /run/dbus/system_bus_socket:/run/dbus/system_bus_socket:ro
    # ... 其他配置
```

### 方法 2：Systemd 私有套接字

对于 D-Bus 套接字方法不起作用的系统，挂载 systemd 私有套接字：

```yaml
services:
  beszel-agent:
    volumes:
      - /run/systemd/private:/run/systemd/private:ro
    # ... 其他配置
```

### 方法 3：特权容器 (不推荐)

作为最后的手段，使用特权访问运行容器（出于安全原因不推荐）：

```yaml
services:
  beszel-agent:
    privileged: true
    # ... 其他配置
```

### 安全注意事项
- **方法 1** 是最安全且推荐的方法
- **方法 2** 提供对 systemd 内部的访问，但比**方法 3**更安全
- **方法 3** 赋予容器完整的系统访问权限，仅应在其他方法失败时使用

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

### 权限错误

常见错误消息和解决方案：

- `Failed to connect to system bus`：检查 Docker 中的 D-Bus 套接字挂载
- `Access denied`：代理可能需要额外的功能或用户权限
- `Connection refused`：Systemd 可能未运行或套接字路径不正确
- `Rejected send message, 2 matched rules`：D-Bus 策略阻止访问（systemd < 243 时常见）。
- `Unknown method 'ListUnitsByPatterns'`：systemd < 243 中不支持此方法。Systemd 监控将无法工作。

### Docker 特定问题

- **套接字未找到**：验证主机在预期路径上有套接字文件
- **权限被拒绝**：容器用户可能需要不同的 UID/GID 映射
- **连接超时**：防火墙规则可能阻止 D-Bus 通信

## 兼容性

**Systemd 版本**：需要 systemd 243+ 才能获得 `ListUnitsByPatterns` 方法支持
