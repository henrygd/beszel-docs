# Advanced Deployment

Community examples and templates for various deployment methods.

## Ansible

We recommend using the `community.beszel` Ansible Collection.

- [GitHub repository](https://github.com/ansible-collections/community.beszel)
- [Ansible Galaxy](https://galaxy.ansible.com/ui/repo/published/community/beszel/)
- [Agent role documentation](https://galaxy.ansible.com/ui/repo/published/community/beszel/content/role/agent/)
- [Hub role documentation](https://galaxy.ansible.com/ui/repo/published/community/beszel/content/role/hub/)
- [Module documentation](https://galaxy.ansible.com/ui/repo/published/community/beszel/content/module/system/)

Thanks to [dbrennand](https://github.com/dbrennand) and all contributors for maintaining this collection.

For other useful examples see [this discussion](https://github.com/henrygd/beszel/discussions/1094) on GitHub.

## Docker Swarm

Beszel agents should run in `global` mode, thus once on every node:

```yaml
services:
  beszel-agent:
    image: henrygd/beszel-agent:0.19.0 # Replace with the latest version
    deploy:
      mode: global
    environment:
      BESZEL_AGENT_HUB_URL: http://beszel-hub:8090
      BESZEL_AGENT_KEY_FILE: /run/secrets/hub-key
      BESZEL_AGENT_TOKEN_FILE: /run/secrets/hub-token
    networks:
      - beszel-hub
    secrets:
      - hub-key
      - hub-token
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /var/run/docker.sock
        read_only: true

networks:
  beszel-hub:
    internal: true

secrets:
  hub-key:
    name: beszel-hub-key-1
    external: true
  hub-token:
    name: beszel-hub-token-1
    external: true
```

The `secrets` should be created once the hub was deployed but before deploying the agents.

In this example the Hub runs in the same cluster as service named `beszel-hub`. The common `beszel-hub` network ensures that hub and agents can communicate with each other; no external traffic is allowed. If the hub is located externally, update the `BESZEL_AGENT_HUB_URL` accordingly and drop the internal `beszel-hub` network.

## HashiCorp Nomad

::: tip 0.12.0 Update
This guide was written prior to the introduction of universal tokens and agent-initiated WebSocket connections.

It should now be simpler to deploy agents in cluster environments. Feel free to share feedback or updated examples on our [GitHub Discussions](https://github.com/henrygd/beszel/discussions) page.
:::

An example Nomad configuration can be found in the article below by [blinkinglight](https://github.com/blinkinglight):

https://dev.to/blinkinglight/tailscale-and-beszel-on-hashicorp-nomad-1jmo

## Kubernetes

::: tip 0.12.0 Update
This guide was written prior to the introduction of universal tokens and agent-initiated WebSocket connections.

It should now be simpler to deploy agents in cluster environments. Feel free to share feedback or updated examples on our [GitHub Discussions](https://github.com/henrygd/beszel/discussions) page.
:::

::: info Source discussion

The following was shared by [nodesocket](https://github.com/nodesocket) in [this discussion](https://github.com/henrygd/beszel/discussions/431) on GitHub.

:::

#### Hub

Use a standard Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) and expose via a loadBalancer service or ingress. Nothing special is really needed for the hub.

#### Agents

Use a Kubernetes [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) (_deploys exactly one pod on every node automatically)_ and then add `tolerations` to allow deploying to the master/control-plane nodes. Finally, a few additional networking attributes such as `hostNetwork` and `ports` are needed.

##### Example Agent DaemonSet YAML

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: beszel-agent
  namespace: default
spec:
  selector:
    matchLabels:
      app: beszel-agent
  template:
    metadata:
      labels:
        app: beszel-agent
    spec:
      hostNetwork: true
      containers:
        - env:
            - name: LISTEN
              value: "45876"
            - name: KEY
              value: "YOUR-KEY-HERE"
          image: henrygd/beszel-agent:latest
          imagePullPolicy: Always
          name: beszel-agent
          ports:
            - containerPort: 45876
              hostPort: 45876
      restartPolicy: Always
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/master
          operator: Exists
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
          operator: Exists
  updateStrategy:
    rollingUpdate:
      maxSurge: 0
      maxUnavailable: 100%
    type: RollingUpdate
```

##### Note on WebSocket timeouts

Whe using a Beszel Hub address (`HUB_URL`) on your Agents which is being served by an Ingess Controller like NGINX, make sure to increase the proxy read / send timeouts. Otherwise the connection will periodically abort and your nodes will be reported as offline.

For the Kubernetes NGINX Ingress Controller, add a `proxy-read-timeout` and `proxy-send-timeout` annotation.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
```

#### Adding Systems to Beszel

Since we are using `hostNetwork: true` you use the Kubernetes node IP address when adding the system. **Note: This is NOT the internal Kubernetes IP but the physical IP of the node itself.** Each Kubernetes node only runs a single agent pod thus why this works.
