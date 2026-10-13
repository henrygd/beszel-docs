# Package Updates

Beszel shows the number of pending package updates for each Linux system in the **Updates** column of the systems table. The system page lists each package with its current and available version.

The dot next to the count shows the status:

- Red: at least one security update is pending.
- Yellow: updates are pending, none of them security updates.
- Green: the system is up to date.

## How it works

The agent detects the system's package manager and asks it which packages can be upgraded. Checks run in the background, so they never delay other metrics.

Checks run every hour by default. Set [`PACKAGE_UPDATES_INTERVAL`](./environment-variables) to a duration like `30m` or `6h` to change this, or to `0` to disable package update checks.

The agent does not install packages. Most package managers use existing system metadata, but Arch and Void refresh repository metadata at most once every 12 hours. Arch uses `checkupdates` to maintain a separate package database, while Void uses `xbps-install -Mun`.

Package updates are only checked by the binary agent on Linux. The Docker agent skips them, because the container's packages are not the host's.

## Supported distributions

| Distribution | Package manager | Security updates | Metadata refreshed by |
| --- | --- | --- | --- |
| Debian, Ubuntu | apt | Per package | `apt-daily.timer` (enabled by default) or `apt update` |
| Fedora, RHEL, Rocky, Alma | dnf | Per package | `dnf-makecache.timer` or `dnf makecache` |
| openSUSE, SLES | zypper | Count only | `zypper refresh` |
| Arch and derivatives | checkupdates (pacman-contrib) | Not available | `checkupdates` (every 12h) |
| Alpine | apk | Not available | `apk update` |
| Void Linux | xbps | Not available | `xbps-install -Mun` (every 12h) |

### Debian and Ubuntu

Updates come from a simulated upgrade (`apt-get -s dist-upgrade`). Packages from a `-security` repository are marked as security updates.

APT package lists must be refreshed regularly for updates to appear. Ensure `apt-daily.timer` is enabled and automatic package list updates are configured, or run `apt update` periodically.

### Fedora, RHEL, Rocky and Alma

Updates come from `dnf check-update` against the local metadata cache. Security updates are marked from the repository's advisories.

`dnf-makecache.timer` keeps the cache up to date, but it may be disabled in minimal or container images. If no updates ever show, check it with `systemctl status dnf-makecache.timer`.

On RHEL-based distributions (dnf4), the agent service needs a writable `/var/tmp`. See [Systemd service](#systemd-service).

### openSUSE and SLES

Updates come from `zypper list-updates`. Security patches are counted, but zypper does not link them to individual packages, so the list on the system page has no security flags.

The agent service needs a writable `/var/tmp`. See [Systemd service](#systemd-service).

### Arch

Updates are checked using `checkupdates` from the `pacman-contrib` package, which must be installed.

`checkupdates` maintains a separate copy of the package sync databases, allowing Beszel to detect available updates without modifying the system's package databases or installing packages.

The agent refreshes this separate database at most once every 12 hours. Checks between refreshes use the cached data. Security update classification is not available for Arch.

### Alpine

Updates come from `apk -u list` against the local package index, which `apk update` refreshes.

## Systemd service

The install script runs the agent as the `beszel` user with `ProtectSystem=strict`, which makes most of the file system read-only. dnf on RHEL-based distributions and zypper need to write temporary files to `/var/tmp`, so the service needs `PrivateTmp=yes`:

```ini
[Service]
PrivateTmp=yes
```

The install script adds this to new installs. For an existing install, re-run the install script or add it with `systemctl edit beszel-agent` and restart the agent.

### Void Linux

Updates are checked using `xbps-install -Mun`, which refreshes repository metadata and simulates an upgrade without installing packages. Installed versions are obtained from `xbps-query -l`.

The agent refreshes repository metadata at most once every 12 hours. Checks between refreshes reuse the cached update list, excluding packages that have since been upgraded or removed.

Security update classification is not available for Void Linux.

## Troubleshooting

If the Updates column stays empty, set `LOG_LEVEL=debug` and check the agent logs:

```bash
journalctl -u beszel-agent | grep -i "package updates"
```

- `Package updates manager=...` means the package manager was detected. If this line is missing, the distribution is not supported, or the agent runs in a container.
- `Package updates check failed err=...` includes the error from the package manager.

To run the check the same way the agent service does, use `systemd-run`. For example, on a dnf-based system:

```bash
sudo systemd-run --pipe --wait -p User=beszel -p ProtectSystem=strict -p ProtectHome=read-only -p PrivateTmp=yes \
  dnf -q -C check-update
```

Exit code `100` means updates are available and `0` means none are. Any other exit code is an error, and the output explains it.
