<script setup>
  import pkg from '../../package.json'
</script>

# Compiling

Both the hub and agent are written in Go, so you can easily build them yourself, or cross-compile for different platforms. Please [install Go](https://go.dev/doc/install) first if you haven't already.

## Clone the repository

<!-- TODO: Add the version tag back in after 0.12.8 is released -->
<!-- git clone --branch v{{pkg.version}} --depth 1 https://github.com/henrygd/beszel.git -->

```bash-vue
# Clone the repository
git clone --depth 1 https://github.com/henrygd/beszel.git
# Navigate to the repository
cd beszel
```

## Using Makefile

Run `make`. This creates a `build` directory containing the binaries.

```bash
# Builds both the agent and hub
make
# Builds the agent only
make build-agent
# Builds the hub only (requires Node or Bun)
make build-hub
```

You can also build for different platforms:

```bash
make OS=freebsd ARCH=arm64
```

See a list of valid options by running `go tool dist list`.

## Manual compilation

### Prepare dependencies

```bash
go mod tidy
```

### Agent

Go to `src/cmd/agent` and run the following command to create a binary in the current directory:

```bash
go build -ldflags "-w -s" .
```

::: tip Windows builds require an additional step
We embed [LibreHardwareMonitorLib](https://github.com/LibreHardwareMonitor/LibreHardwareMonitor) and a .NET wrapper in the Windows executable, so you need to build this first:

```bash
dotnet build -c Release ./agent/lhm/beszel_lhm.csproj
```

:::

### Hub

The hub embeds the web UI in the binary, so you must build the website first. I use [Bun](https://bun.sh/), but you may use Node.js if you prefer:

```bash
cd src/site
bun install
bun run build
```

Then in `src/cmd/hub`:

```bash
go build -ldflags "-w -s" .
```

### Cross-compiling

You can cross-compile for different platforms using the `GOOS` and `GOARCH` environment variables.

For example, to build for FreeBSD ARM64:

```bash
GOOS=freebsd GOARCH=arm64 go build -ldflags "-w -s" .
```

See a list of valid options by running `go tool dist list`.
