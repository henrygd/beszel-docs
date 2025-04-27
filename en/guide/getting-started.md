# Getting Started

For background information, see the [What is Beszel?](./what-is-beszel.md) page.

## 1. Start the hub

The hub can be run with a single binary file or with Docker / Podman.

- [Binary](./hub-installation#binary)
- [Docker or Podman](./hub-installation#docker-or-podman)

<div style="height: 1px; margin: -5px 0 0"></div>

<!-- @include: ./parts/hub-docker-instructions.md -->

## 2. Create an admin user

After starting the hub, navigate to <http://localhost:8090> or your chosen address.

You will be prompted to create an account:

<a href="/image/admin-creation.png" target="_blank">
  <img src="/image/admin-creation.png" height="485" width="671" alt="Screenshot of user creation form" />
</a>

## 3. Configure your first system

Click the **Add System** button in the top right corner to open the system creation dialog. We're using a local unix socket in this example, but you can use a remote agent instead.

Do not click the **Add System** button inside the dialog until you've started up the agent.

<a href="/image/add-system-socket-2.png" target="_blank">
  <img src="/image/add-system-socket-2.png" height="589" width="896" alt="Screenshot of system creation form" />
</a>

## 4. Start the agent

:::: details Docker instructions

::: tip NOTE
If you prefer to set up containers in a different way, please feel free to do so.
:::

1. Copy the `docker-compose.yml` content from the **Add System** dialog.

2. Create a directory somewhere to store the agent's `docker-compose.yml` file.

```bash
mkdir beszel-agent
cd beszel-agent
```

3. Create a `docker-compose.yml` file and paste in the content provided in the **Add System** dialog.

::: code-group

```bash [nano]
nano docker-compose.yml
```

```bash [vim]
vim docker-compose.yml
```

```bash [emacs]
emacs docker-compose.yml
```

```bash [vscode]
code docker-compose.yml
```

:::

4. Start the agent.

```bash
docker compose up -d
```

::::

:::: details Binary instructions
::: warning The install script is for Linux only
If you use a different OS, please manually download and run the correct binary for your system. See the [Agent Installation](./agent-installation.md#binary) page or the [Compiling](./compiling.md) page for more information.
:::

1. Copy the binary install command from the **Add System** dialog.

2. Open a terminal and run the command.

This will download the correct binary, create a user called `beszel`, and start the agent. It also creates a service to keep it running after reboot, and optionally enables automatic daily updates.
::::

## 5. Finish adding the system

Now that the agent is running, click the **Add System** button in the dialog.

You will see the new system in table. If it flips to green, you're good to go.

<a href="/image/new-system.png" target="_blank">
  <img src="/image/new-system.png" height="263" width="1418" alt="Screenshot of system creation form" />
</a>

If it changes to red, check the [Common Issues](./common-issues.md) page.
