# Upgrading with WinGet

::: tip Work in progress

This is currently being tested with the 0.12.0 release. If the upgrade fails, please check back later.
:::

<!-- This guide explains how to upgrade the Beszel Agent on Windows systems, particularly when installed via WinGet. -->

## The WinGet path issue

WinGet uses versioned installation paths that change during upgrades.

When this happens, the NSSM service will still point to the old path, causing the upgrade or service restart to fail.

## Upgrade methods

### Method 1: Upgrade script

The simplest method is to run the upgrade script:

```powershell
& iwr -useb https://get.beszel.dev/upgrade -OutFile "$env:TEMP\upgrade-agent.ps1"; & Powershell -ExecutionPolicy Bypass -File "$env:TEMP\upgrade-agent.ps1"
```

The script will:

- Check if the service exists
- Upgrade the agent using your package manager (Scoop or WinGet)
- Compare the old and new executable paths
- Update the NSSM service configuration if the path changed
- Restart the service with the new path

### Method 2: Re-run installation script

Re-running the installation script with your key should work for the time being.

```powershell
& iwr -useb https://get.beszel.dev -OutFile "$env:TEMP\install-agent.ps1"; & Powershell -ExecutionPolicy Bypass -File "$env:TEMP\install-agent.ps1" -Key "your-ssh-key-here"
```

### Method 3: Manual upgrade process

If you prefer to do it manually:

1. **Upgrade the package**:

<!-- ```powershell
# For WinGet users:
winget upgrade --exact --id henrygd.beszel-agent

# For Scoop users:
scoop update beszel-agent
``` -->

```powershell
winget upgrade --exact --id henrygd.beszel-agent
```

2. **Find the new executable path**:

```powershell
# Check if it's in PATH:
Get-Command beszel-agent

# Or search common locations:
Get-ChildItem -Path "$env:ProgramFiles\WinGet\Packages\henrygd.beszel-agent*\beszel-agent.exe"
```

3. **Update the NSSM service** (requires admin privileges):

```powershell
# Stop the service
nssm stop beszel-agent

# Update the application path
nssm set beszel-agent Application "C:\new\path\to\beszel-agent.exe"

# Start the service
nssm start beszel-agent
```

## Automated upgrades

We have a wrapper script that can be used to automate the upgrade process. It is available in the [supplemental/scripts](https://github.com/henrygd/beszel/tree/main/supplemental/scripts) directory of our GitHub repository.

If GitHub is blocked in your country, you can download the wrapper script at [get.beszel.dev/upgrade-wrapper](https://get.beszel.dev/upgrade-wrapper). If the `raw.githubusercontent.com` URL in the script is blocked, change it to `https://get.beszel.dev/upgrade`.

### Using Windows Task Scheduler

You can set up automated upgrades using Windows Task Scheduler:

1. Create a new task that runs daily or weekly
2. Set it to run with highest privileges (required for NSSM)
3. Configure it to run the upgrade script: `powershell.exe -ExecutionPolicy Bypass -File "C:\path\to\upgrade-agent-wrapper.ps1"`

### Using Group Policy (enterprise)

For enterprise environments, you can deploy the upgrade script via Group Policy:

1. Place the upgrade script in a network share
2. Create a Group Policy that runs the script as a scheduled task
3. Configure appropriate execution permissions

## Troubleshooting

### Service won't start after upgrade

If the service fails to start after an upgrade:

1. **Check the service configuration**:

```powershell
nssm get beszel-agent Application
```

2. **Verify the path exists**:

```powershell
Test-Path "C:\path\shown\by\previous\command\beszel-agent.exe"
```

3. **Find the correct path**:

```powershell
Get-ChildItem -Path "$env:ProgramFiles\WinGet\Packages\henrygd.beszel-agent*\beszel-agent.exe" -Recurse
```

4. **Update the service path**:

```powershell
nssm set beszel-agent Application "C:\correct\path\to\beszel-agent.exe"
nssm start beszel-agent
```

### Permission issues

If you encounter permission issues:

1. Ensure you're running PowerShell as Administrator
2. Check that NSSM is accessible (should be in PATH or specify full path)
3. Verify the beszel-agent executable is accessible

### Path not found

If the agent executable cannot be found after upgrade:

1. **Refresh your PATH environment variable**:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
```

2. **Search for the executable manually**:

```powershell
Get-ChildItem -Path "$env:ProgramFiles" -Recurse -Name "beszel-agent.exe" -ErrorAction SilentlyContinue
Get-ChildItem -Path "$env:LOCALAPPDATA" -Recurse -Name "beszel-agent.exe" -ErrorAction SilentlyContinue
```

## Support

If you continue to experience issues with upgrades:

1. Check [GitHub Issues](https://github.com/henrygd/beszel/issues) and [Discussions](https://github.com/henrygd/beszel/discussions) for similar problems
2. Review the service logs at `%ProgramData%\beszel-agent\logs\beszel-agent.log`
3. Use `nssm status beszel-agent` to check service status
4. Run the upgrade script with verbose output for debugging
