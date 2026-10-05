# Wi-Fi Monitoring

Beszel shows the signal strength of each system's connected Wi-Fi interfaces. This is available in agent version 0.21.0 and later.

The **Wi-Fi** column in the systems table shows the strongest connection. Hover over it to see every connected interface with its SSID. The system page has a **Wi-Fi signal** chart with the signal history of each interface.

The signal strength is the RSSI in dBm. Values closer to zero are stronger:

- Green: -65 dBm or stronger.
- Yellow: -66 to -75 dBm.
- Red: weaker than -75 dBm.

## How it works

The agent only reports interfaces that are currently connected to a network. It never scans for nearby networks.

The signal is collected on the normal update interval. Real-time mode reuses the last reading instead of querying the interface every second.

If an interface is connected but does not report a signal, it is listed in the table without a value, and the chart is hidden.

To disable Wi-Fi monitoring, set [`SKIP_WIFI=true`](./environment-variables) on the agent.

## Platform support

| Platform | Source | Notes |
| --- | --- | --- |
| Linux | nl80211 | Docker agent needs `network_mode: host`. |
| macOS | CoreWLAN | The SSID may be hidden by macOS privacy settings. |
| Windows | Native WLAN API | Interfaces are named by adapter name, such as `Wi-Fi`. |
| FreeBSD and others | - | Not supported. |

### Linux

The agent reads the signal from the kernel over nl80211, the same interface used by `iw`. It is skipped when `/sys/class/ieee80211` lists no wireless devices, so hosts without Wi-Fi hardware are not affected.

The Docker agent can only see the host's wireless interfaces with host networking:

```yaml
beszel-agent:
  image: henrygd/beszel-agent
  network_mode: host
```

### macOS

The agent reads the signal from CoreWLAN through `osascript`. It does not need `sudo`.

macOS may hide the SSID from apps that do not have location access. In that case, the interface is shown without a network name, but the signal is still reported.

### Windows

The agent uses the native WLAN API. Interfaces are named by their adapter name, such as `Wi-Fi`, and fall back to the interface GUID if the name is not available.

## Troubleshooting

If the Wi-Fi column stays empty:

- Make sure the agent is version 0.21.0 or later and `SKIP_WIFI` is not set.
- On Linux, check that the interface is connected with `iw dev <interface> link`.
- For the Docker agent, make sure the container uses `network_mode: host`.
