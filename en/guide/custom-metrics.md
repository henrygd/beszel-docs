# Custom Metrics

Beszel can chart numbers it does not collect itself, such as board power, room temperature, queue depth or API request volume. A script or exporter writes them to a file in the Prometheus text format, and the agent sends them to the hub with its other stats. This needs agent and hub version X.Y.Z or later.

Custom charts appear in the **Custom** tab, or after the Wi-Fi chart in the default layout.

[![Custom tab](/image/custom-metrics-tab.png)](/image/custom-metrics-tab.png)

## Configuration

The agent reads its sources from `config.yml` in its [data directory](./environment-variables#data-dir), usually `/var/lib/beszel-agent`, or `%APPDATA%\beszel-agent` on Windows. Set [`CONFIG`](./environment-variables) to use another file. The file is optional: without it, nothing changes. The agent picks up edits without a restart.

```yaml
metrics:
  sources:
    - path: /run/beszel-power # a directory of *.prom files, a file or a glob
      max_age: 60s
      chart:
        title: Power consumption
        description: Measured board power and modelled at-the-wall power
      display_names:
        pi_power_board_watts: Board power
        pi_power_wall_estimate_watts: Wall power (est)
```

| Setting | Default | Description |
| --- | --- | --- |
| `max_series` | `64` | Most series the agent reports, up to `256`. |
| `max_age` | `2m` | Samples older than this are dropped. Can also be set per source. |
| `counters` | `rate` | How counters are shown: `rate`, `delta`, `raw` or `skip`. Can also be set per source. |
| `sources[].path` | required | A directory (its `*.prom` files), a file or a glob. Relative paths start from the config file's directory. |
| `sources[].include`, `exclude` | unset | Glob patterns on metric names, such as `[myapp_*]`. |
| `sources[].prefix` | unset | Put in front of every series name, to keep apart producers that write the same names. |
| `sources[].chart` | unset | The `title`, and an optional `description`, of one chart for all the source's series. |
| `sources[].display_names` | unset | Line names, keyed by series name (see [Data file format](#data-file-format)). |

Unknown keys are ignored, a source with an invalid value is skipped, and a config that cannot be parsed keeps the last good one. Each case is logged. Durations need a unit, such as `60s`.

For the Docker agent, mount the metrics directory read-only, and put `config.yml` in the agent's data volume. Paths in `config.yml` are paths inside the container. In `docker-compose.yml`:

```yaml
volumes:
  - ./beszel_agent_data:/var/lib/beszel-agent
  - /run/beszel-power:/run/beszel-power:ro
```

## Data file format

Files use the [Prometheus text format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format). For example, `/run/beszel-power/power.prom`:

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

- Gauges, counters and untyped metrics are supported, with labels and optional timestamps in milliseconds. Histograms, summaries and other multi-sample types are skipped.
- `# HELP`, `# TYPE` and `# UNIT` lines go before their samples: directly above them, or in a block at the top of the file.
- The unit comes from `# UNIT`, or from the end of the name: `_watts`, `_volts`, `_amperes`, `_joules`, `_bytes`, `_seconds`, `_celsius`, `_hertz`, `_ratio` or `_percent`, before any `_total`.
- Counters are shown as per-second rates. Set `counters` to `delta` for the change between writes, `raw` for the total, or `skip` to leave them out.
- A series is named after its metric and its label values, in label-name order, with the source's `prefix` in front: `disk_temp_celsius{device="sda"}` becomes `disk_temp_celsius_sda`. Use this name in `display_names`.

## Producer rules

The agent only reads files. Each producer runs on its own schedule, for example from a systemd timer, and must:

1. Replace its file atomically: write a temporary file in the same directory, with a name that does not end in `.prom`, then rename it over the real file.
2. Rewrite the file every cycle, even when nothing changed. The file's age tells the agent whether the producer is alive.
3. Write nothing when it fails, so its series show a gap instead of an old value.
4. Leave the file readable by the agent's user.

Set the source's `max_age` to about three times the producer's write interval.

## Charts

- Without `chart`, each metric gets its own chart, titled from its name (`disk_temp_celsius` reads "Disk temp celsius"), with a line for each labelled series.
- `chart.title` puts all of a source's series on one chart, and sources with the same title share it. `chart.description` sets the text under the title; otherwise a chart with a single series shows its `# HELP` text.
- `display_names` renames lines in the legend and tooltip, never the stored series. A metric with a single series and a display name also takes it as its chart's title.
- Bytes are scaled to KB, MB and up. Byte rates follow the **Disk unit** setting, and temperatures follow the **Temperature unit** setting.
- A chart appears only while it has data in the selected time range.

[![Custom charts in the default layout](/image/custom-metrics-default-layout.png)](/image/custom-metrics-default-layout.png)

## Removing a metric

Stop its producer, delete its file, or remove its source from `config.yml`. The chart shows a gap from that point on. Its history keeps its title, line names and unit for up to 30 days after the file or source is gone, and the chart disappears once that history is outside the selected time range. Stored values expire with the system's other stats.

Pausing a system clears these names. Its custom charts return when the agent reports again, but series removed before then show their raw names.

## Troubleshooting

Check the agent's log. Each time it loads `config.yml`, it logs `Custom metrics config loaded` with the number of sources.

| Log message | What to do |
| --- | --- |
| `Invalid custom metrics config` | Fix the YAML. Durations need a unit, such as `60s`. The agent keeps the last good config. |
| `Custom metrics config` with `unknown key` or `skipped` | A setting is misspelled or has the wrong type. The rest of the config applies. |
| `Custom metrics config not loaded` | The file named by `CONFIG` is missing, or the agent cannot read the file. |
| `Custom metrics source not readable`, `Custom metrics file not readable` | Check the `path`, and that the agent's user can read it. |
| `Unparseable lines in custom metrics file skipped` | Fix the line the message names. |
| `Custom metric series share keys with earlier series` | Two series have the same name. Set a `prefix` on one source, or narrow its `include`. |
| `Custom metric keys too long, skipped` | Series names are limited to 128 bytes. Shorten the label values or the prefix. |
| `Custom metrics file too large, skipped` | Files are limited to 64 KiB. |
| `Too many custom metric series` | Raise `max_series`, up to 256, or narrow `include`. |
| `Custom metric timestamps ahead of the agent's clock` | Write timestamps in milliseconds, or leave them out. |

If there is no chart and no message:

- The file may be older than `max_age`. Make sure the producer rewrites it every cycle.
- A counter needs two readings before it shows a rate.
- `include` patterns match metric names, such as `pi_power_*`.
- For the Docker agent, the path in `config.yml` must be the path inside the container.
