# 开发者指南

感谢您对 Beszel 开发的兴趣！

我们欢迎您的贡献，如果您计划进行任何重大更改，最好先在讨论或问题中与我们联系。

## 先决条件

- Go 1.25.1+（用于修改 Go 代码）
- Bun 1.1+ 或 Node 18+（用于修改 Web 用户界面）

如果您还没有，请 [fork 仓库](https://github.com/henrygd/beszel/fork) 并克隆您的 fork 到本地工作：

```bash
git clone https://github.com/your_username/beszel.git
```

::: tip 为不同的更改创建单独的分支
建议为每个错误修复和功能创建一个新的分支。
如果您计划提交多个 PR 以便在最终合并之前单独进行审查，则这是必需的。
:::

## 开发环境

为了进行项目开发，需要启动三个进程：

1. 中心 (Go)
2. 代理程序 (Go)
3. Web UI (TypeScript / Vite)

每个作业都有一个 `make` 命令启动。

```bash
# 启动中心
make dev-hub
# 启动代理程序
make dev-agent KEY="..." TOKEN="..." HUB_URL="..."
# 启动 Web UI
make dev-server
```

或者，您可以一次启动所有进程并结合输出：

```bash
make -j dev KEY="..." TOKEN="..." HUB_URL="..."
```

导航到 [http://localhost:8090](http://localhost:8090) 查看 Web UI。

::: tip 提示
如果安装了 [`entr`](https://github.com/eradman/entr)，则当您保存代码更改时，中心/代理程序会自动重建。
:::

## 排除生成的语言文件

如果您使用 `build` 命令构建 Web UI，`locales` 目录中的许多语言文件可能会被更新。

请在 `.git/info/exclude` 中排除此目录，以避免提交这些更改。

```bash
echo "locales/" >> .git/info/exclude
```

## VSCode 配置

您可以尝试以下 VSCode 配置，以便更轻松地处理项目。欢迎推荐您认为有用的任何更改。

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
