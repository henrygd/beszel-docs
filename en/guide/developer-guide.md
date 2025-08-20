# Developer Guide

Thanks for your interest in contributing to Beszel!

Contributions are welcome, but it's a good idea to check with us first in a discussion or issue if you plan on doing anything significant.

## Prerequisites

- Go 1.24+ (for making changes in the Go code)
- Bun 1.1+ or Node 18+ (for making changes in the web UI)

If you haven't already, [fork the repository](https://github.com/henrygd/beszel/fork) and clone your fork to work locally:

```bash
git clone https://github.com/your_username/beszel.git
```

::: tip Separate branches for separate changes
It is recommended to create a new branch for each of your bugfixes and features.
This is required if you are planning to submit multiple PRs in order to keep the changes separate for review until they eventually get merged.
:::

## Development environment

Three processes need to be started in order to work on the project:

1. The hub (Go)
2. The agent (Go)
3. The web UI (TypeScript / Vite)

There are `make` commands to start each of these jobs (run in `/beszel`).

```bash
# Start the hub
make dev-hub
# Start the agent
KEY="..." make dev-agent
# Start the web UI
make dev-server
```

Alternatively, you can start all processes at once with combined output:

```bash
KEY="..." make -j dev
```

Navigate to [http://localhost:8090](http://localhost:8090) to view the web UI.

::: tip
If [`entr`](https://github.com/eradman/entr) is installed, the hub / agent will automatically rebuild when you save changes to the code.
:::
