# Advanced Deployment

Community examples and templates for various deployment methods.

## Ansible

We recommend using the `community.beszel` Ansible Collection.

- [GitHub repository](https://github.com/ansible-collections/community.beszel)
- [Ansible Galaxy](https://galaxy.ansible.com/ui/repo/published/community/beszel/)
- [Agent role documentation](https://galaxy.ansible.com/ui/repo/published/community/beszel/content/role/agent/)

Thanks to [dbrennand](https://github.com/dbrennand) and all contributors for maintaining this collection.

For other useful examples see [this discussion](https://github.com/henrygd/beszel/discussions/1094) on GitHub.

## Docker Swarm

::: tip 0.12.0 Update
This guide was written prior to the introduction of universal tokens and agent-initiated WebSocket connections.

It should now be simpler to deploy agents in cluster environments. Feel free to share feedback or updated examples on our [GitHub Discussions](https://github.com/henrygd/beszel/discussions) page.
:::

The recommended approach is to define each agent separately and constrain it to a unique host / port.

For more info please search our GitHub issues for "swarm" or see examples by [aeoneros](https://github.com/aeoneros):

https://wiki.aeoneros.com/books/beszel/page/quickstart-guide

```yaml
x-common-config: &common-config
  image: henrygd/beszel-agent:latest
  restart: unless-stopped
  network_mode: host
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
  environment:
    KEY: 'YOUR_PUBLIC_KEY_FROM_HUB'
  deploy: &common-deploy
    mode: replicated
    replicas: 1

services:
  beszel-agent1:
    <<: *common-config
    ports:
      - 45876:45876
    environment:
      <<: *common-config.environment
      LISTEN: '45876'
    deploy:
      <<: *common-deploy
      placement:
        constraints:
          - node.hostname == host-one

  beszel-agent2:
    <<: *common-config
    ports:
      - 45877:45877
    environment:
      <<: *common-config.environment
      LISTEN: '45877'
    deploy:
      <<: *common-deploy
      placement:
        constraints:
          - node.hostname == host-two
```

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

#### Adding Systems to Beszel

Since we are using `hostNetwork: true` you use the Kubernetes node IP address when adding the system. **Note: This is NOT the internal Kubernetes IP but the physical IP of the node itself.** Each Kubernetes node only runs a single agent pod thus why this works.
