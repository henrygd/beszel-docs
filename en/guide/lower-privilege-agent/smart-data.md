# Lower Privilege S.M.A.R.T. Monitoring

*Note: This has been tested only on Debian.*

## Binary Agent

Rather than running the binary agent as root or giving it admin privileges, it is possible to collect S.M.A.R.T. data through some shims.

1. Install dependencies.
```bash
sudo apt install smartmontools
```
2. Create a folder for shims.
```bash
sudo mkdir /opt/beszel-shims
```
3. Create a script to collect S.M.A.R.T. data at `/opt/beszel-shims/cache_smart.sh`. This script needs to be adapted to the specific drives that you want to track on your system.
```bash
#!/bin/bash

# Installation instructions:

# Add a copy of each line for each drive.
# DEVICE_IDENTIFIER and DRIVE_IDENTIFIER appear to be identical for HDDs.
# They appear to differ slightly for NVMes (nvme0 vs nvme0n1).

# Cache SMART data.
/usr/sbin/smartctl --json=c -a /dev/nvme0 > /opt/beszel-shims/nvme0n1.json
/usr/sbin/smartctl --json=c -a /dev/sda > /opt/beszel-shims/sda.json

# Make it readable by the unprivileged beszel user.
chmod 644 /opt/beszel-shims/nvme0n1.json
chmod 644 /opt/beszel-shims/sda.json
```
4. Create a shim that the agent will use instead of the real `smartctl` at `/opt/beszel-shims/smartctl`.
```bash
#!/bin/bash

# Beszel calls smartctl with arguments like: smartctl --json=c -a /dev/nvme0n1
# We look at the last argument to see which drive it wants:
DRIVE="${@: -1}"
DRIVE_NAME=$(basename "$DRIVE")

if [ -f "/opt/beszel-shims/${DRIVE_NAME}.json" ]; then
  cat "/opt/beszel-shims/${DRIVE_NAME}.json"
else
  # Fallback to standard command if we don't have SMART data for the drive.
  /usr/sbin/smartctl "$@"
fi
```
5. Make the scripts executable.
```bash
sudo chmod +x /opt/beszel-shims/cache_smart.sh
sudo chmod +x /opt/beszel-shims/smartctl
```
6. Open the `root` `crontab` for editing.
```bash
sudo crontab -e
```
7. Add this line to cache S.M.A.R.T. data every 5 minutes.
```cron
*/5 * * * * /opt/beszel-shims/cache_smart.sh
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

You should now have S.M.A.R.T. data without giving the agent any capabilities or elevated privileges; you can even remove the `beszel` user from all groups except `beszel`.
