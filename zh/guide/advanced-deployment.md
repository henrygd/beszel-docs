# 高级部署

社区提供的各种部署方法的示例和模板。

## Ansible

我们推荐使用 `community.beszel` Ansible 集合。

- [GitHub 仓库](https://github.com/ansible-collections/community.beszel)
- [Ansible Galaxy](https://galaxy.ansible.com/ui/repo/published/community/beszel/)
- [代理角色文档](https://galaxy.ansible.com/ui/repo/published/community/beszel/content/role/agent/)

感谢 [dbrennand](https://github.com/dbrennand) 和所有贡献者维护这个集合。

其他有用的示例请在 GitHub 的[此讨论](https://github.com/henrygd/beszel/discussions/1094) 中查看。

## Docker Swarm

Beszel 代理应以 `global` 模式运行，即在每个节点上运行一次：

```yaml
services:
  beszel-agent:
    image: henrygd/beszel-agent:0.19.0 # 替换为最新版本
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

`secrets` 应在 Hub 部署完成后、部署代理之前创建。

在此示例中，Hub 与名为 `beszel-hub` 的服务运行在同一集群中。共用的 `beszel-hub` 网络可确保 Hub 与代理之间能够相互通信；不允许外部流量。如果 Hub 位于外部，请相应地更新 `BESZEL_AGENT_HUB_URL` 并删除内部 `beszel-hub` 网络。

## HashiCorp Nomad

::: tip 0.12.0 更新
这些指南是在引入通用令牌和代理发起的 WebSocket 连接之前编写的。

现在在集群环境中部署代理应该更简单了。欢迎在我们的 [GitHub 讨论](https://github.com/henrygd/beszel/discussions) 页面分享反馈或更新的示例。
:::

[blinkinglight](https://github.com/blinkinglight) 在以下文章中提供了一个 Nomad 配置示例：

https://dev.to/blinkinglight/tailscale-and-beszel-on-hashicorp-nomad-1jmo

## Kubernetes

::: tip 0.12.0 更新
这些指南是在引入通用令牌和代理发起的 WebSocket 连接之前编写的。

现在在集群环境中部署代理应该更简单了。欢迎在我们的 [GitHub 讨论](https://github.com/henrygd/beszel/discussions) 页面分享反馈或更新的示例。
:::

::: info 来源讨论

以下内容由 [nodesocket](https://github.com/nodesocket) 在 GitHub 的[此讨论](https://github.com/henrygd/beszel/discussions/431) 中分享。

:::

#### Hub

使用标准的 Kubernetes [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) 并通过负载均衡服务或 Ingress 暴露。Hub 不需要特殊配置。

#### 代理

使用 Kubernetes [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/)（_自动在每个节点上部署一个 Pod_），然后添加 `tolerations` 以允许部署到主节点/控制平面节点。最后，需要一些额外的网络属性，例如 `hostNetwork` 和 `ports`。

##### 示例代理 DaemonSet YAML

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

#### 将系统添加到 Beszel

由于我们使用了 `hostNetwork: true`，因此在添加系统时需要使用 Kubernetes 节点的 IP 地址。**注意：这不是 Kubernetes 内部 IP，而是节点本身的物理 IP。** 每个 Kubernetes 节点只运行一个代理 Pod，因此这种方法有效。

##### 关于 WebSocket 超时的说明

当在代理上使用由 Ingress 控制器（如 NGINX）提供服务的 Beszel Hub 地址（`HUB_URL`）时，请确保增加代理读取/发送超时时间。否则连接会定期中止，您的节点将被报告为离线。

对于 Kubernetes NGINX Ingress 控制器，添加 `proxy-read-timeout` 和 `proxy-send-timeout` 注解。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-read-timeout: "3600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "3600"
```

```

```
