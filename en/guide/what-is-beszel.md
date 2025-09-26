# What is Beszel?

Beszel is a lightweight server monitoring platform that includes Docker statistics, historical data, and alert functions.

It has a friendly web interface, simple configuration, and is ready to use out of the box. It supports automatic backup, multi-user, OAuth authentication, and API access.

<div style="display: flex; flex-wrap: wrap; gap: .5em; margin: 1.6em 0 -.3em">
  <a href="https://hub.docker.com/r/henrygd/beszel-agent" target="_blank">
    <img height="20" width="171" src="https://img.shields.io/docker/image-size/henrygd/beszel-agent/latest?logo=docker&label=agent%20image%20size" alt="Hub Docker Image Size" />
  </a>
  <a href="https://hub.docker.com/r/henrygd/beszel" target="_blank">
    <img height="20" width="169" src="https://img.shields.io/docker/image-size/henrygd/beszel/latest?logo=docker&label=hub%20image%20size" alt="Agent Docker Image Size" />
  </a>
  <a href="https://github.com/henrygd/beszel/blob/main/LICENSE" target="_blank">
    <img height="20" width="78" src="https://img.shields.io/github/license/henrygd/beszel?color=%239944ee" alt="MIT license" />
  </a>
  <a href="https://crowdin.com/project/beszel" target="_blank">
    <img height="20" width="97" src="https://badges.crowdin.net/beszel/localized.svg" alt="Crowdin translations" />
  </a>
</div>

## Features

- **Lightweight**: Smaller and less resource-intensive than leading solutions.
- **Simple**: Easy setup, no need for public internet exposure.
- **Docker stats**: Tracks CPU, memory, and network usage history for each container.
- **Alerts**: Configurable alerts for CPU, memory, disk, bandwidth, temperature, load average, and status.
- **Multi-user**: Users manage their own systems. Admins can share systems across users.
- **OAuth / OIDC**: Supports many OAuth2 providers. Password auth can be disabled.
- **Automatic backups**: Save and restore data from disk or S3-compatible storage.

## Architecture

Beszel consists of two main components: the **hub** and the **agent**.

- **Hub**: A web application built on [PocketBase](https://pocketbase.io/) that provides a dashboard for viewing and managing connected systems.
- **Agent**: Runs on each system you want to monitor and communicates system metrics to the hub.

## Screenshots

<div style="display: grid; gap: 15px;">
  <a href="/image/dashboard.png" target="_blank">
    <img src="/image/dashboard.png" height="967" width="1419" alt="Dashboard page showing multiple connected systems" /> 
  </a>
  <a href="/image/system-full.png" target="_blank">
    <img src="/image/system-full.png" height="2551" width="1422" alt="System page showing detailed metrics" /> 
  </a>
  <!-- [![Alerts](/image/alerts.png)](/image/alerts.png) -->
  <a href="/image/settings-notifications.png" target="_blank">
    <img src="/image/settings-notifications.png" height="928" width="1429" alt="Notification Settings page" /> 
  </a>
</div>

## Supported metrics

- **CPU usage** - Host system and Docker / Podman containers.
- **Memory usage** - Host system and containers. Includes swap and ZFS ARC.
- **Disk usage** - Host system. Supports multiple partitions and devices.
- **Disk I/O** - Host system. Supports multiple partitions and devices.
- **Network usage** - Host system and containers.
- **Load average** - Host system.
- **Temperature** - Host system sensors.
- **GPU usage / power draw** - Nvidia, AMD, and Intel.
- **Battery** - Host system battery charge.
