# Getting started

Beszel is a lightweight server monitoring platform that includes Docker statistics, historical data, and alert functions.

It has a friendly web interface, simple configuration, and is ready to use out of the box. It supports automatic backup, multi-user, OAuth authentication, and API access.

## Background

Beszel consists of two main components: the **hub** and the **agent**.

- **Hub**: A web application built on [PocketBase](https://pocketbase.io/) that provides a dashboard for viewing and managing connected systems.

- **Agent**: Runs on each system you want to monitor, creating a minimal SSH server to communicate system metrics to the hub.

<!-- :::tip
Beszel uses active probing, where the **_Hub_** requests data from the **_Agent_**. This setup requires the **_Agent_** to have an open port accessible by the **_Hub_**. If the **_Agent_** is on the public internet, it must have a public IP address with an open port for the **_Hub_** to access.

There is no need to expose the Hub to the public internet; the active mode is relatively safer.
::: -->

## Installation

Beszel supports installation via Docker or using binaries.

- [Docker](./install-hub#docker)
- [Binary](./install-hub#binary)
