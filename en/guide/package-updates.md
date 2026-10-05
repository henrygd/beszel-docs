# Package Updates

Beszel shows the number of pending package updates for each Linux system in the **Updates** column of the systems table. The system page lists each package with its current and available version.

The dot next to the count shows the status:

- Red: at least one security update is pending.
- Yellow: updates are pending, none of them security updates.
- Green: the system is up to date.

## How it works

The agent detects the system's package manager and asks it which packages can be upgraded. Checks run in the background, so they never delay other metrics.

Checks run every hour by default. Set [`PACKAGE_UPDATES_INTERVAL`](./environment-variables) to a duration like `30m` or `6h` to change this, or to `0` to disable package update checks.

The agent never refreshes package lists or installs anything. It reads the package metadata that the system has already downloaded, so the result is only as recent as the last refresh by the system or the user. See the table below for what refreshes the metadata on each distribution.

Package updates are only checked by the binary agent on Linux. The Docker agent skips them, because the container's packages are not the host's.

## Supported distributions

| Distribution | Package manager | Security updates | Metadata refreshed by |
| --- | --- | --- | --- |
| Debian, Ubuntu | apt | Per package | `apt-daily.timer` (enabled by default) or `apt update` |
| Fedora, RHEL, Rocky, Alma | dnf | Per package | `dnf-makecache.timer` or `dnf makecache` |
| openSUSE, SLES | zypper | Count only | `zypper refresh` |
| Arch and derivatives | pacman | Not available | `pacman -Sy` (usually as part of `pacman -Syu`) |
| Alpine | apk | Not available | `apk update` |

### Debian and Ubuntu

Updates come from a simulated upgrade (`apt-get -s dist-upgrade`). Packages from a `-security` repository are marked as security updates. No extra setup is needed.

### Fedora, RHEL, Rocky and Alma

Updates come from `dnf check-update` against the local metadata cache. Security updates are marked from the repository's advisories.

`dnf-makecache.timer` keeps the cache up to date, but it may be disabled in minimal or container images. If no updates ever show, check it with `systemctl status dnf-makecache.timer`.

On RHEL-based distributions (dnf4), the agent service needs a writable `/var/tmp`. See [Systemd service](#systemd-service).

### openSUSE and SLES

Updates come from `zypper list-updates`. Security patches are counted, but zypper does not link them to individual packages, so the list on the system page has no security flags.

The agent service needs a writable `/var/tmp`. See [Systemd service](#systemd-service).

### Arch

Updates come from `pacman -Qu`, which compares installed packages with the sync databases.

On Arch, the sync databases are usually only refreshed by `pacman -Syu`, which also installs the updates. Updates therefore only show between a database sync and the next upgrade, and the system usually shows as up to date.

### Alpine

Updates come from `apk -u list` against the local package index, which `apk update` refreshes.

## Systemd service

The install script runs the agent as the `beszel` user with `ProtectSystem=strict`, which makes most of the file system read-only. dnf on RHEL-based distributions and zypper need to write temporary files to `/var/tmp`, so the service needs `PrivateTmp=yes`:

```ini
[Service]
PrivateTmp=yes
```

The install script adds this to new installs. For an existing install, re-run the install script or add it with `systemctl edit beszel-agent` and restart the agent.

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
