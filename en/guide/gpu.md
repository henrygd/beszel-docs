# GPU Monitoring

Beszel can monitor GPU usage, temperature, and power draw.

::: warning Binary agent only
The Docker agent does not support GPU monitoring. You **must use the binary agent**.
:::

## AMD GPUs

Beszel uses `rocm-smi` to monitor AMD GPUs. This must be installed on the system.

#### Make sure <code>rocm-smi</code> is accessible

Installing `rocm-smi-lib` on Arch and Debian places the `rocm-smi` binary in `/opt/rocm`. If this isn't in the `PATH` of the user running `beszel-agent`, symlink to `/usr/local/bin`:

```bash
sudo ln -s /opt/rocm/bin/rocm-smi /usr/local/bin/rocm-smi
```

## Nvidia GPUs

Beszel uses `nvidia-smi` to monitor Nvidia GPUs. This must be installed on the system.

You may need to allow access to your GPUs in the service configuration. See [discussion #563](https://github.com/henrygd/beszel/discussions/563#discussioncomment-12230389) for more information.

```ini
[Service]
DeviceAllow=/dev/nvidiactl rw
DeviceAllow=/dev/nvidia0 rw
# If you have multiple GPUs, make sure to allow all of them
DeviceAllow=/dev/nvidia1 rw
DeviceAllow=/dev/nvidia2 rw
```

```bash
systemctl daemon-reload
systemctl restart beszel-agent
```

## Nvidia Jetson

Jetson devices are supported as of version 0.11.0.

You must have `tegrastats` installed because `nvidia-smi` is not compatible with Jetson.

## Intel GPUs

Intel GPUs are not currently supported as there doesn't seem to be a straightforward utility like `nvidia-smi` to get utilization and memory usage.

We may add support for tracking usage of video and 3D rendering engines in the future with `intel-gpu-top`.

Please see [issue #262](https://github.com/henrygd/beszel/issues/262) for more information.
