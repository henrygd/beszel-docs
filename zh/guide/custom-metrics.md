# 自定义指标

Beszel 可以为它自身不采集的数值绘制图表，例如主板功耗、室内温度、队列长度或 API 请求量。脚本或导出器（exporter）以 Prometheus 文本格式将这些数值写入文件，Agent 会把它们与其他统计数据一起发送到 Hub。此功能需要 Agent 和 Hub 版本 X.Y.Z 或更高版本。

自定义图表显示在 **Custom**（自定义）选项卡中；在默认布局中，则显示在 Wi-Fi 图表之后。

[![自定义选项卡](/image/custom-metrics-tab.png)](/image/custom-metrics-tab.png)

## 配置

Agent 从其[数据目录](./environment-variables#data-dir)中的 `config.yml` 读取数据源，通常为 `/var/lib/beszel-agent`，在 Windows 上为 `%APPDATA%\beszel-agent`。设置 [`CONFIG`](./environment-variables) 可以使用其他文件。该文件是可选的：没有它，一切照旧。修改文件后，Agent 无需重启即可生效。

```yaml
metrics:
  sources:
    - path: /run/beszel-power # *.prom 文件所在的目录、单个文件或通配符
      max_age: 60s
      chart:
        title: Power consumption
        description: Measured board power and modelled at-the-wall power
      display_names:
        pi_power_board_watts: Board power
        pi_power_wall_estimate_watts: Wall power (est)
```

| 设置 | 默认值 | 说明 |
| --- | --- | --- |
| `max_series` | `64` | Agent 最多报告的序列数，上限为 `256`。 |
| `max_age` | `2m` | 早于此时长的样本会被丢弃。也可以按数据源设置。 |
| `counters` | `rate` | 计数器的显示方式：`rate`、`delta`、`raw` 或 `skip`。也可以按数据源设置。 |
| `sources[].path` | 必填 | 目录（其中的 `*.prom` 文件）、单个文件或通配符。相对路径从配置文件所在目录开始。 |
| `sources[].include`、`exclude` | 未设置 | 匹配指标名称的通配符模式，例如 `[myapp_*]`。 |
| `sources[].prefix` | 未设置 | 加在每个序列名称前面，用于区分写入相同名称的不同生产者。 |
| `sources[].chart` | 未设置 | 一个图表的 `title` 和可选的 `description`，该数据源的所有序列都显示在这个图表中。 |
| `sources[].display_names` | 未设置 | 线条名称，以序列名称为键（参见[数据文件格式](#数据文件格式)）。 |

未知的键会被忽略，含有无效值的数据源会被跳过，无法解析的配置会保留上一次的有效配置。每种情况都会记录在日志中。时长需要带单位，例如 `60s`。

对于 Docker Agent，请以只读方式挂载指标目录，并将 `config.yml` 放在 Agent 的数据卷中。`config.yml` 中的路径是容器内的路径。在 `docker-compose.yml` 中：

```yaml
volumes:
  - ./beszel_agent_data:/var/lib/beszel-agent
  - /run/beszel-power:/run/beszel-power:ro
```

## 数据文件格式

文件使用 [Prometheus 文本格式](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format)。例如 `/run/beszel-power/power.prom`：

```text
# HELP pi_power_board_watts Board power, summed over all PMIC rails.
# TYPE pi_power_board_watts gauge
# UNIT pi_power_board_watts watts
pi_power_board_watts 2.01
# HELP pi_power_wall_estimate_watts Modelled at-the-wall power, including PSU loss.
# TYPE pi_power_wall_estimate_watts gauge
# UNIT pi_power_wall_estimate_watts watts
pi_power_wall_estimate_watts 2.91
```

- 支持 gauge（仪表）、counter（计数器）和无类型指标，可带标签和以毫秒为单位的可选时间戳。直方图、摘要及其他多样本类型会被跳过。
- `# HELP`、`# TYPE` 和 `# UNIT` 行要写在其样本之前：紧挨在样本上方，或放在文件顶部的一个块中。
- 单位取自 `# UNIT`，或取自名称结尾（位于 `_total` 之前）：`_watts`、`_volts`、`_amperes`、`_joules`、`_bytes`、`_seconds`、`_celsius`、`_hertz`、`_ratio` 或 `_percent`。
- 计数器显示为每秒速率。将 `counters` 设为 `delta` 显示两次写入之间的变化量，设为 `raw` 显示累计值，设为 `skip` 则不显示。
- 序列名称由指标名称和按标签名排序的标签值组成，数据源的 `prefix` 在最前面：`disk_temp_celsius{device="sda"}` 会变为 `disk_temp_celsius_sda`。在 `display_names` 中使用这个名称。

## 生产者规则

Agent 只读取文件。每个生产者按自己的计划运行，例如通过 systemd 定时器，并且必须：

1. 以原子方式替换文件：先在同一目录中写入一个名称不以 `.prom` 结尾的临时文件，再将其重命名覆盖正式文件。
2. 每个周期都重写文件，即使内容没有变化。Agent 通过文件的时间判断生产者是否仍在运行。
3. 失败时不写入任何内容，这样其序列会显示为空缺，而不是旧数值。
4. 确保 Agent 的运行用户可以读取该文件。

将数据源的 `max_age` 设为生产者写入间隔的大约三倍。

## 图表

- 未设置 `chart` 时，每个指标都有自己的图表，标题由其名称生成（`disk_temp_celsius` 显示为 "Disk temp celsius"），每个带标签的序列为一条线。
- `chart.title` 会把一个数据源的所有序列放在同一个图表中，标题相同的数据源共用该图表。`chart.description` 设置标题下方的文字；否则，只有一个序列的图表会显示其 `# HELP` 文本。
- `display_names` 只重命名图例和提示框中的线条，从不改变已存储的序列。只有一个序列且设置了显示名称的指标，也会用该名称作为图表标题。
- 字节会按 KB、MB 等单位缩放。字节速率遵循 **磁盘单位** 设置，温度遵循 **温度单位** 设置。
- 只有在所选时间范围内有数据时才会显示图表。

[![默认布局中的自定义图表](/image/custom-metrics-default-layout.png)](/image/custom-metrics-default-layout.png)

## 移除指标

停止其生产者、删除其文件，或从 `config.yml` 中移除其数据源。图表会从那一刻起显示空缺。文件或数据源移除后，其历史数据最多在 30 天内保留标题、线条名称和单位；当这段历史超出所选时间范围后，图表就会消失。已存储的数值会与系统的其他统计数据一起过期。

暂停系统会清除这些名称。Agent 再次报告后，自定义图表会重新出现，但在此之前移除的序列会显示其原始名称。

## 故障排除

请查看 Agent 的日志。每次加载 `config.yml` 时，Agent 都会记录 `Custom metrics config loaded` 及数据源数量。

| 日志消息 | 处理方法 |
| --- | --- |
| `Invalid custom metrics config` | 修正 YAML。时长需要带单位，例如 `60s`。Agent 会保留上一次的有效配置。 |
| `Custom metrics config`，带有 `unknown key` 或 `skipped` | 某个设置拼写错误或类型错误。配置的其余部分仍然生效。 |
| `Custom metrics config not loaded` | `CONFIG` 指定的文件不存在，或 Agent 无法读取该文件。 |
| `Custom metrics source not readable`、`Custom metrics file not readable` | 检查 `path`，并确认 Agent 的运行用户可以读取它。 |
| `Unparseable lines in custom metrics file skipped` | 修正消息中指出的那一行。 |
| `Custom metric series share keys with earlier series` | 两个序列名称相同。为其中一个数据源设置 `prefix`，或缩小其 `include` 范围。 |
| `Custom metric keys too long, skipped` | 序列名称最长 128 字节。缩短标签值或前缀。 |
| `Custom metrics file too large, skipped` | 文件最大 64 KiB。 |
| `Too many custom metric series` | 提高 `max_series`（最多 256），或缩小 `include` 范围。 |
| `Custom metric timestamps ahead of the agent's clock` | 以毫秒为单位写入时间戳，或者不写时间戳。 |

如果没有图表，也没有日志消息：

- 文件可能早于 `max_age`。确认生产者每个周期都会重写文件。
- 计数器需要两次读数后才能显示速率。
- `include` 模式匹配的是指标名称，例如 `pi_power_*`。
- 对于 Docker Agent，`config.yml` 中的路径必须是容器内的路径。
