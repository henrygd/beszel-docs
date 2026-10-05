# Wi-Fi 监控

Beszel 会显示每个系统已连接 Wi-Fi 接口的信号强度。此功能需要 Agent 版本 0.21.0 或更高版本。

系统表格中的 **Wi-Fi** 列显示信号最强的连接。将鼠标悬停在其上可查看所有已连接的接口及其 SSID。系统页面中有 **Wi-Fi 信号** 图表，显示每个接口的信号历史。

信号强度为以 dBm 为单位的 RSSI。数值越接近零，信号越强：

- 绿色：-65 dBm 或更强。
- 黄色：-66 至 -75 dBm。
- 红色：弱于 -75 dBm。

## 工作原理

Agent 只报告当前已连接到网络的接口，从不扫描附近的网络。

信号按正常的更新间隔采集。实时模式会复用上一次的读数，而不是每秒查询接口。

如果某个接口已连接但未报告信号，它会在表格中显示但没有数值，并且图表会被隐藏。

要禁用 Wi-Fi 监控，请在 Agent 上设置 [`SKIP_WIFI=true`](./environment-variables)。

## 平台支持

| 平台 | 数据来源 | 说明 |
| --- | --- | --- |
| Linux | nl80211 | Docker Agent 需要 `network_mode: host`。 |
| macOS | CoreWLAN | SSID 可能会被 macOS 隐私设置隐藏。 |
| Windows | 原生 WLAN API | 接口以适配器名称命名，例如 `Wi-Fi`。 |
| FreeBSD 及其他 | - | 不支持。 |

### Linux

Agent 通过 nl80211 从内核读取信号，与 `iw` 使用的接口相同。当 `/sys/class/ieee80211` 中没有无线设备时会跳过采集，因此没有 Wi-Fi 硬件的主机不受影响。

Docker Agent 只有在使用主机网络时才能看到主机的无线接口：

```yaml
beszel-agent:
  image: henrygd/beszel-agent
  network_mode: host
```

### macOS

Agent 通过 `osascript` 从 CoreWLAN 读取信号，无需 `sudo`。

macOS 可能会对没有位置访问权限的应用隐藏 SSID。此时接口会显示为没有网络名称，但信号仍会被报告。

### Windows

Agent 使用原生 WLAN API。接口以适配器名称命名，例如 `Wi-Fi`，如果名称不可用则回退为接口 GUID。

## 故障排除

如果 Wi-Fi 列一直为空：

- 确保 Agent 版本为 0.21.0 或更高，并且未设置 `SKIP_WIFI`。
- 在 Linux 上，使用 `iw dev <接口> link` 检查接口是否已连接。
- 对于 Docker Agent，确保容器使用 `network_mode: host`。
