# Developer Guide

Thanks for your interest in contributing to Beszel!

Contributions are welcome, but it's a good idea to check with us first in a discussion or issue if you plan on doing anything significant.

## Prerequisites

- Go 1.25.1+ (for making changes in the Go code)
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

There are `make` commands to start each of these jobs.

```bash
# Start the hub
make dev-hub
# Start the agent
make dev-agent KEY="..." TOKEN="..." HUB_URL="..."
# Start the web UI
make dev-server
```

Alternatively, you can start all processes at once with combined output:

```bash
make -j dev KEY="..." TOKEN="..." HUB_URL="..."
```

Navigate to [http://localhost:8090](http://localhost:8090) to view the web UI.

::: tip
If [`entr`](https://github.com/eradman/entr) is installed, the hub / agent will automatically rebuild when you save changes to the code.
:::

## Exclude generated locale files

If you build the web UI with the `build` command, many language files may be updated in the `locales` directory.

Please exclude this directory in `.git/info/exclude` to avoid committing these changes.

```bash
echo "locales/" >> .git/info/exclude
```

## VSCode configuration

You can try the following VSCode config to make it easier to work on the project. Feel free to recommend any changes you think would be helpful.

### `.vscode/settings.json`

```json
{
  "go.buildFlags": [
    "-tags=testing,development"
  ],
  "go.testEnvVars": {
    "GOEXPERIMENT": "synctest"
  },
  "go.toolsEnvVars": {
    "GOEXPERIMENT": "synctest"
  },
  "biome.configurationPath": "./internal/site/biome.json",
  "biome.lsp.bin": "./internal/site/node_modules/@biomejs/biome/bin/biome"
}
```

### `.vscode/launch.json`

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Start hub",
			"type": "go",
			"request": "launch",
			"mode": "auto",
			"cwd": "${workspaceFolder}/internal/cmd/hub",
			"program": "${workspaceFolder}/internal/cmd/hub/hub.go",
			"args": ["serve"]
		},
		{
			"name": "Start agent",
			"type": "go",
			"request": "launch",
			"mode": "auto",
			"cwd": "${workspaceFolder}/internal/cmd/agent",
			"env": {
				"KEY": "<key>",
				"TOKEN": "<token>",
				"HUB_URL": "http://localhost:8090"
			},
			"program": "${workspaceFolder}/internal/cmd/agent/agent.go"
		}
	]
}
```