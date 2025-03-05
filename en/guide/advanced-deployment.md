# Advanced Deployment

Community examples and templates for various deployment methods.

## Ansible

A role to install and configure agents has been published on [Ansible Galaxy](https://galaxy.ansible.com/ui/standalone/roles/dbrennand/beszel/documentation/) by [dbrennand](https://github.com/dbrennand). The source code is available at [dbrennand/ansible-role-beszel](https://github.com/dbrennand/ansible-role-beszel).

Below are example roles provided by [hellofaduck](https://github.com/hellofaduck) in a [discussion post](https://github.com/henrygd/beszel/discussions/629) on GitHub.

#### Installation with service existing check

```yaml
- name: Populate service facts
  ansible.builtin.service_facts:

- name: Download the install-agent.sh script
  get_url:
    url: https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh
    dest: /tmp/install-agent.sh
    mode: '0755'  # Set executable permissions
    
- name: Remove beszel agent if service exists
  become: true
  ansible.builtin.command:
    cmd: /tmp/install-agent.sh -u
  when: ansible_facts.services['beszel-agent.service'] is defined

- name: Run the install-agent.sh script
  shell: |
    if [ "{{ beszel_agent_autoupdate }}" = "true" ]; then 
      yes | /tmp/install-agent.sh -p {{ beszel_agent_ssh_port }} -k "{{ beszel_agent_ssh_key }}"
    else 
      yes N | /tmp/install-agent.sh -p {{ beszel_agent_ssh_port }} -k "{{ beszel_agent_ssh_key }}" 
    fi
  ignore_errors: false
```

#### Uninstall


```yaml
- name: Remove beszel-agent if service exists
  block:
    - name: Populate service facts
      ansible.builtin.service_facts:
    
    - name: Download install-agent.sh script
      ansible.builtin.get_url:
        url: https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh
        dest: /tmp/install-agent.sh
        mode: '0755'  # Set executable permissions
      when: ansible_facts['services']['beszel-agent.service'] is defined
    
    - name: Remove beszel agent
      become: true
      ansible.builtin.command:
        cmd: /tmp/install-agent.sh -u
      when: ansible_facts['services']['beszel-agent.service'] is defined
```

You will need to add these variables to your `all.yml` file:

```yaml
# --= CUSTOM ADDONS =--
# Beszel monitoring ssh key for installing beszel agents on all nodes
beszel_agent: true
beszel_agent_autoupdate: true
beszel_agent_ssh_key: "ssh-ed25519 lalalal"
beszel_agent_ssh_port: 45876
```

## Docker Swarm

Better support for Swarm is planned. For now the recommended approach is to define each agent separately and constrain it to a unique host / port.

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

An example Nomad configuration can be found in the article below by [blinkinglight](https://github.com/blinkinglight):

https://dev.to/blinkinglight/tailscale-and-beszel-on-hashicorp-nomad-1jmo


## Kubernetes

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