# 高级部署

社区提供的各种部署方法的示例和模板。

## Ansible

[dbrennand](https://github.com/dbrennand) 在 [Ansible Galaxy](https://galaxy.ansible.com/ui/standalone/roles/dbrennand/beszel/documentation/) 上发布了一个用于安装和配置代理的角色。源代码可在 [dbrennand/ansible-role-beszel](https://github.com/dbrennand/ansible-role-beszel) 获取。

以下是 [hellofaduck](https://github.com/hellofaduck) 在 GitHub 的[讨论帖子](https://github.com/henrygd/beszel/discussions/629) 中提供的示例角色。

#### 安装并检查服务是否存在

```yaml
- name: 收集服务信息
  ansible.builtin.service_facts:

- name: 下载 install-agent.sh 脚本
  get_url:
    url: https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh
    dest: /tmp/install-agent.sh
    mode: '0755'  # 设置可执行权限
    
- name: 如果服务存在则删除 beszel 代理
  become: true
  ansible.builtin.command:
    cmd: /tmp/install-agent.sh -u
  when: ansible_facts.services['beszel-agent.service'] is defined

- name: 运行 install-agent.sh 脚本
  shell: |
    if [ "{{ beszel_agent_autoupdate }}" = "true" ]; then 
      yes | /tmp/install-agent.sh -p {{ beszel_agent_ssh_port }} -k "{{ beszel_agent_ssh_key }}"
    else 
      yes N | /tmp/install-agent.sh -p {{ beszel_agent_ssh_port }} -k "{{ beszel_agent_ssh_key }}" 
    fi
  ignore_errors: false
```

#### 卸载

```yaml
- name: 如果服务存在则删除 beszel-agent
  block:
    - name: 收集服务信息
      ansible.builtin.service_facts:
    
    - name: 下载 install-agent.sh 脚本
      ansible.builtin.get_url:
        url: https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh
        dest: /tmp/install-agent.sh
        mode: '0755'  # 设置可执行权限
      when: ansible_facts['services']['beszel-agent.service'] is defined
    
    - name: 删除 beszel 代理
      become: true
      ansible.builtin.command:
        cmd: /tmp/install-agent.sh -u
      when: ansible_facts['services']['beszel-agent.service'] is defined
```

您需要将这些变量添加到 `all.yml` 文件中：

```yaml
# --= 自定义附加项 =--
# Beszel 监控 SSH 密钥，用于在所有节点上安装 beszel 代理
beszel_agent: true
beszel_agent_autoupdate: true
beszel_agent_ssh_key: "ssh-ed25519 lalalal"
beszel_agent_ssh_port: 45876
```

## Docker Swarm

计划未来更好地支持 Swarm。目前推荐的方法是分别定义每个代理，并将其约束到唯一的主机/端口。

更多信息请在 GitHub 问题中搜索 "swarm"，或查看 [aeoneros](https://github.com/aeoneros) 的示例：

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

[blinkinglight](https://github.com/blinkinglight) 在以下文章中提供了一个 Nomad 配置示例：

https://dev.to/blinkinglight/tailscale-and-beszel-on-hashicorp-nomad-1jmo

## Kubernetes

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