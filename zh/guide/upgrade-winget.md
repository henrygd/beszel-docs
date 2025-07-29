# 使用 WinGet 升级

本指南解释了如何在通过 WinGet 安装的 Windows 系统上升级 Beszel 代理。

## WinGet 路径问题

WinGet 使用版本化安装路径，在升级过程中会发生变化。

当发生这种情况时，NSSM 服务仍会指向旧路径，导致升级或服务重启失败。

## 升级方法

### 方法 1：升级脚本

最简单的方法是运行升级脚本：

```powershell
& iwr -useb https://get.beszel.dev/upgrade -OutFile "$env:TEMP\upgrade-agent.ps1"; & Powershell -ExecutionPolicy Bypass -File "$env:TEMP\upgrade-agent.ps1"
```

该脚本将：

- 检查服务是否存在
- 使用您的包管理器（Scoop 或 WinGet）升级代理
- 比较旧的和新的可执行文件路径
- 如果路径发生变化，更新 NSSM 服务配置
- 使用新路径重启服务

### 方法 2：手动升级过程

如果您更喜欢手动操作：

1. **升级包**：

<!-- ```powershell
# 对于 WinGet 用户：
winget upgrade --exact --id henrygd.beszel-agent

# 对于 Scoop 用户：
scoop update beszel-agent
``` -->

```powershell
winget upgrade --exact --id henrygd.beszel-agent
```

2. **查找新的可执行文件路径**：

```powershell
# 检查是否在 PATH 中：
Get-Command beszel-agent

# 或搜索常见位置：
Get-ChildItem -Path "$env:ProgramFiles\WinGet\Packages\henrygd.beszel-agent*\beszel-agent.exe"
```

3. **更新 NSSM 服务**（需要管理员权限）：

```powershell
# 停止服务
nssm stop beszel-agent

# 更新应用程序路径
nssm set beszel-agent Application "C:\new\path\to\beszel-agent.exe"

# 启动服务
nssm start beszel-agent
```

## 自动升级

我们有一个包装脚本可用于自动化升级过程。它在我们 GitHub 仓库的 [supplemental/scripts](https://github.com/henrygd/beszel/tree/main/supplemental/scripts) 目录中可用。

如果您所在的国家/地区无法访问 GitHub，您可以在 [get.beszel.dev/upgrade-wrapper](https://get.beszel.dev/upgrade-wrapper) 下载包装脚本。如果脚本中的 `raw.githubusercontent.com` URL 被阻止，请将其更改为 `https://get.beszel.dev/upgrade`。

### 使用 Windows 任务计划程序

您可以使用 Windows 任务计划程序设置自动升级：

1. 创建一个每日或每周运行的新任务
2. 设置它以最高权限运行（NSSM 需要）
3. 配置它运行升级脚本：`powershell.exe -ExecutionPolicy Bypass -File "C:\path\to\upgrade-agent-wrapper.ps1"`

### 使用组策略（企业）

对于企业环境，您可以通过组策略部署升级脚本：

1. 将升级脚本放在网络共享中
2. 创建一个将脚本作为计划任务运行的组策略
3. 配置适当的执行权限

## 故障排除

### 升级后服务无法启动

如果升级后服务无法启动：

1. **检查服务配置**：

```powershell
nssm get beszel-agent Application
```

或使用 GUI：

```powershell
nssm edit beszel-agent
```

2. **验证路径是否存在**：

```powershell
Test-Path "C:\path\shown\by\previous\command\beszel-agent.exe"
```

3. **查找正确的路径**：

```powershell
Get-ChildItem -Path "$env:ProgramFiles\WinGet\Packages\henrygd.beszel-agent*\beszel-agent.exe" -Recurse
```

4. **更新服务路径**：

```powershell
nssm set beszel-agent Application "C:\correct\path\to\beszel-agent.exe"
nssm start beszel-agent
```

### 权限问题

如果遇到权限问题：

1. 确保您以管理员身份运行 PowerShell
2. 检查 NSSM 是否可访问（应该在 PATH 中或指定完整路径）
3. 验证 beszel-agent 可执行文件是否可访问

### 找不到路径

如果升级后找不到代理可执行文件：

1. **刷新您的 PATH 环境变量**：

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
```

2. **手动搜索可执行文件**：

```powershell
Get-ChildItem -Path "$env:ProgramFiles" -Recurse -Name "beszel-agent.exe" -ErrorAction SilentlyContinue
Get-ChildItem -Path "$env:LOCALAPPDATA" -Recurse -Name "beszel-agent.exe" -ErrorAction SilentlyContinue
```

## 支持

如果您继续遇到升级问题：

- 查看 [GitHub Issues](https://github.com/henrygd/beszel/issues) 和 [Discussions](https://github.com/henrygd/beszel/discussions) 寻找类似问题
- 查看 `%ProgramData%\beszel-agent\logs\beszel-agent.log` 中的服务日志
- 使用 `nssm status beszel-agent` 检查服务状态
- 使用 `nssm edit beszel-agent` 编辑服务配置
