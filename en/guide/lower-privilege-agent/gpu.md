# Lower Privilege GPU Monitoring

*Note: This has been tested only on Debian with an Intel GPU.*

## Binary Agent

Rather than running the binary agent as root or giving it admin privileges, it is possible to collect GPU data through some shims.

1. Install dependencies.
```bash
sudo apt install intel-gpu-tools
```
2. Create a folder for shims.
```bash
sudo mkdir /opt/beszel-shims
```
3. Create a FIFO pipe for GPU stats and set its permissions properly.
```bash
sudo mkfifo /opt/beszel-shims/intel_gpu_top.pipe
sudo chown root:beszel /opt/beszel-shims/intel_gpu_top.pipe
sudo chmod 640 /opt/beszel-shims/intel_gpu_top.pipe
```
4. Create a shim that the agent will use instead of the real `smartctl` at `/opt/beszel-shims/intel_gpu_top`.
```bash
#!/bin/sh

cat /opt/beszel-shims/intel_gpu_top.pipe
```
5. Make the scripts executable.
```bash
sudo chmod +x /opt/beszel-shims/intel_gpu_top
```
6. Create the GPU stats collection service.
```bash
sudo vim /etc/systemd/system/intel-gpu-top.service
```
```systemd
[Unit]
Description=Intel GPU Metrics Pipe Provider
After=network.target

[Service]
Type=simple

# Uncomment this version if your version of intel_gpu_top does output commas in between JSON objects.
#ExecStart=/bin/sh -c "intel_gpu_top -J -s 1000 > /opt/beszel-shims/intel_gpu_top.pipe"

# Uncomment this version if your version of intel_gpu_top does not output commas in between JSON objects. Requires Docker.
#ExecStart=/bin/sh -c "docker run --privileged registry.freedesktop.org/drm/igt-gpu-tools/igt:v2.6 intel_gpu_top -J -s 1000 > /opt/beszel-shims/intel_gpu_top.pipe"

# Uncomment this version if your version of intel_gpu_top does not output commas in between JSON objects and you want an immutable image. Requires Docker.
#ExecStart=/bin/sh -c "docker run --privileged registry.freedesktop.org/drm/igt-gpu-tools/igt@sha256:d66f5a803ba49c30237850f8598707506a569f361cf4e578a08525fa8cdedb5e intel_gpu_top -J -s 1000 > /opt/beszel-shims/intel_gpu_top.pipe"

Restart=always
RestartSec=1

[Install]
WantedBy=multi-user.target
```

The relevant utility, `intel_gpu_top`, does not have a version string. So to figure out which line to uncomment, run a test of the JSON formatting.
```bash
sudo intel_gpu_top -s 1000 -J
```

Select a line to uncomment based on the output and the comments in the service definition.
7. Start the new service.
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now intel-gpu-top.service
```

If you wish to check the output of the service, check the pipe.
```bash
sudo cat /opt/beszl-shims/intel-gpu-top.pipe
```
8. Set the `PATH` variable for the agent.
```bash
sudo systemctl edit beszel-agent.service
```
```systemd
[Service]
Environment="PATH=/opt/beszel-shims:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```
9. Restart the agent.
```bash
sudo systemctl daemon-reload
sudo systemctl restart beszel-agent.service
```

You should now have GPU data without giving the agent any capabilities or elevated privileges; you can even remove the `beszel` user from all groups except `beszel`.
