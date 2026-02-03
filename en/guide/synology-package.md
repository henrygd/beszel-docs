# Synology NAS Agent Package

The beszel agent can be installed onto any Synology NAS as a Synology package. This allows the agent to run on devices that may not support Docker, and provides a more integrated experience with Synology's DSM operating system.

The package is maintained by not-first and published on the SynoCommunity package repository.


## Before You Begin

### Add the SynoCommunity Repository

::: tip **If on DSM6 or below**

   Log into your NAS as administrator and go to:
   - Main Menu → Package Center → Settings
   - Set Trust Level to "Synology Inc. and trusted publishers"
:::

In the Package Sources tab of Package Center Settings:
- Click **Add**
- Enter `SynoCommunity` as Name
- Enter `https://packages.synocommunity.com/` as Location
- Click **OK** to validate

### (Optional) SMART Monitoring Prerequisites

SMART monitoring is **optional** and can be skipped if you don't need disk health monitoring.

::: warning Important
If you want SMART monitoring, you should follow the dependency steps **before** installing the beszel agent.
:::

If you want SMART monitoring, install the `SynoCli Disk Tools` package from SynoCommunity now:
1. Open Package Center and go to the **Community** tab
2. Search for `SynoCli Disk Tools`
3. Click **Install** and complete the installation

This package provides an updated `smartctl` binary, as the default version included with DSM is severely outdated.

After this installation is complete, run the command `sudo setcap 'cap_sys_rawio+ep' $(readlink -f /usr/local/bin/smartctl)` in a terminal session with root access (e.g SSH) to allow the smartctl binary to access SMART data.


## Installing the Beszel Agent Package

1. Open Package Center and go to the **Community** tab
2. Search for `beszel agent`
3. Click **Install**

You will immediately be prompted with a configuration screen. See the next section for how to fill in these settings.


## Configuring the Beszel Agent

During the installation process, you will be prompted to input configuration details for the beszel agent.

![synology-agent-package-setup-ui.png](../../image/synology-agent-package-setup-ui.png)

### Public Key

**Required.** Enter your beszel agent's public key.

### Filesystems to Monitor
**Optional.** Sets the value of the `EXTRA_FILESYSTEMS` environment variable. See the [relevant documentation](./additional-disks#binary-agent) for more information.

This is advised, as by default the beszel agent only monitors the root filesystem (`/`), which may not include all disks on your NAS. Utilise the path format `/volume{n}__Label` to specify additional filesystems to monitor, separated by commas. If an external USB drive is connected, it can be specified using the `/volumeUSB{n}/usbshare__Label` format.

**Example:** `/volume1__Main Storage,/volumeUSB1/usbshare__External Backup`

### SMART Monitoring

**Optional.** Sets the value of the `ENABLE_SMART` environment variable. See the [relevant documentation](./environment-variables#smart-devices) for more information. Leave blank to disable SMART monitoring. If you have not followed the prerequisite steps above, cancel the installation and do so now.

::: warning
This requires that you have followed the dependency steps as described in the [prerequisites section](#optional-smart-monitoring-prerequisites) above.
:::

Specify your drives in the format `/dev/sd{x}:sat`, separated by commas.

**Example:** `/dev/sda:sat,/dev/sdb:sat,/dev/sdc:sat`

- `/dev/sda:sat` for Drive 1
- `/dev/sdb:sat` for Drive 2
- `/dev/sdr:sat` is typically used for an external USB drive

::: info
Although your disks may not be of the `sat` type, this is the required format for beszel to be able to read SMART data.
:::



