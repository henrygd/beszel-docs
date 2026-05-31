# Synology NAS Agent Package

The beszel agent can be installed onto any Synology NAS as a Synology package. This allows the agent to run on devices that may not support Docker, and provides a more integrated experience with Synology's DSM operating system.

The package is maintained by not-first and published as '[Beszel Agent ADD THIS LINK WHEN AVAILABLE](https://example.com/)' on the [SynoCommunity package repository](https://synocommunity.com/). The code is open source and can be viewed on [Github](https://github.com/SynoCommunity/spksrc/tree/master/spk/beszel-agent).


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

THIS DOCUMENTATION IS UNFINISHED AS PERMISSION ISSUES REGARDING THE PACKAGE HAVE NOT BEEN RESOLVED.


## Installing the Beszel Agent Package

1. Open Package Center and go to the **Community** tab
2. Search for `beszel agent`
3. Click **Install**

You will immediately be prompted with a configuration screen. See the next section for how to fill in these settings.


## Configuring the Beszel Agent

During the installation process, you will be prompted to input configuration details for the beszel agent.

<a href="/image/synology-agent-package-setup-ui.png" target="_blank">
   <img src="/image/synology-agent-package-setup-ui.png" height="146" width="554" alt="Beszel agent package configuration screen" />
</a>

### Public Key

**Required.** Enter your beszel agent's public key.

### Filesystems to Monitor
**Optional.** Sets the value of the `EXTRA_FILESYSTEMS` environment variable. See the [relevant documentation](./additional-disks#binary-agent) for more information.

This is advised, as by default the beszel agent only monitors the root filesystem (`/`), which may not include all disks on your NAS. Utilise the path format `/volume{n}__Label` to specify additional filesystems to monitor, separated by commas. If an external USB drive is connected, it can be specified using the `/volumeUSB{n}/usbshare__Label` format.

**Example:** `/volume1__Main Storage,/volumeUSB1/usbshare__External Backup`

### Other Environment Variables
**Optional.** You can set any other environment variables to configure the agent as needed, in a semicolon-separated list.

For example, if you want to enable websocket connection instead of the default SSH, you can set `HUB_URL=<url>;TOKEN=<token>` here.

### SMART Monitoring

**Optional.** Sets the value of the `ENABLE_SMART` environment variable. See the [relevant documentation](./environment-variables#smart-devices) for more information. Leave blank to disable SMART monitoring. If you have not followed the prerequisite steps above, cancel the installation and do so now.

::: warning
This requires that you have followed the dependency steps as described in the [prerequisites section](#optional-smart-monitoring-prerequisites) above.
:::

Specify your drives in the format `/dev/sd{x}:sat`, separated by commas. You can see your drives by running `/usr/local/bin/smartctl --scan` in the terminal of your NAS. The `:sat` suffix is required for beszel to be able to read SMART data, and should be included even if your drives are not of the `sat` type.

**Example:** `/dev/sda:sat,/dev/sdb:sat,/dev/sdc:sat`

- `/dev/sda:sat` for Drive 1
- `/dev/sdb:sat` for Drive 2
- `/dev/sdr:sat` is typically used for an external USB drive

::: info
Although your disks may not be of the `sat` type, this is the required format for beszel to be able to read SMART data.
:::



