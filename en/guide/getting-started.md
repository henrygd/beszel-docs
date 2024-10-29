# Getting started

## Preparation

Beszel consists of two main components: the hub and the agent.

- **Hub**: A web application that provides a dashboard for viewing and managing connected systems.

- **Agent**: Runs on each system you want to monitor, creating a minimal SSH server to communicate system metrics to the hub.

:::tip
Beszel uses active probing, where the ***Hub*** requests data from the ***Agent***. This setup requires the ***Agent*** to have an open port accessible by the ***Hub***. If the ***Agent*** is on the public internet, it must have a public IP address with an open port for the ***Hub*** to access.

There is no need to expose the Hub to the public internet; the active mode is relatively safer.
:::

## Installation

Beszel supports installation via Docker or using binaries.

- [Docker](./install-hub#docker)
- [Binary](./install-hub#binary)