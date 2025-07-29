# Security

The hub and agent can communicate with each other over SSH or WebSocket.

## SSH connection

The SSH connection is initiated by the hub and connects to the agent's SSH server. This is ideal when your hub can reach your agents, but your agents cannot reach the hub. For example, if you're running the hub on a private network and the agents are on a public network.

When the hub is started for the first time, it generates an ED25519 key pair.

The agent's SSH server is configured to accept connections using this key only. It does not provide a pseudo-terminal or accept input, so it's impossible to execute commands on the agent even if your private key is compromised.

## WebSocket connection

The WebSocket connection is initiated by the agent and connects to the hub's URL.

We use a mutual authentication handshake that ensures both parties are trusted before any data is exchanged.

1. **Initial connection and token verification:** The agent initiates a WebSocket connection to the hub. It includes a unique registration `token` as an HTTP header during the upgrade request. The hub verifies that the token is associated with an existing system before upgrading the connection.

2. **Hub challenge:** To prove its identity to the agent, the hub signs the token using its private key and sends the signature back to the agent. The agent verifies the signature using its public key.

3. **Fingerprint authentication:** After verifying the hub, the agent responds by sending its `fingerprint`. This fingerprint is a secure hash of unique identifiers, locking the agent's registration to the machine it's running on. The hub verifies the received fingerprint matches the one stored for the system. If they match, the connection is authorized.

## Reporting a vulnerability

If you find a vulnerability in the latest version, please [submit a private advisory](https://github.com/henrygd/beszel/security/advisories/new).

If it's low severity (use best judgement) you may open an issue instead of an advisory.

## Network requirements

This is a list of ports and remote hosts that Beszel communicates with, based on the default configuration. Using SMTP for email or S3 for backups will require connections to other hosts.

### Agent

#### Incoming

| Port  | Purpose                                                                 |
| ----- | ----------------------------------------------------------------------- |
| 45876 | Allows the hub to connect to the agent via SSH. Port may be customized. |

#### Outgoing

| Remote host  | Port | Purpose                                                                                 |
| ------------ | ---- | --------------------------------------------------------------------------------------- |
| Your hub URL | 8090 | Agent initiated WebSocket connection at `/api/beszel/agent-connect`. Port may be customized or accessed through proxy. |
| github.com   | 443  | Check / download updates (not needed if using Docker)                                   |

### Hub

#### Incoming

| Port | Purpose                                                                      |
| ---- | ---------------------------------------------------------------------------- |
| 8090 | HTTP access to the web UI. Agent WebSocket connection at `/api/beszel/agent-connect`. Port may be customized or accessed through proxy. |

#### Outgoing

| Remote host | Port  | Purpose                                                |
| ----------- | ----- | ------------------------------------------------------ |
| Your agents | 45876 | SSH connection to your agents. Port may be customized. |
| github.com  | 443   | Check / download updates (not needed if using Docker)  |
