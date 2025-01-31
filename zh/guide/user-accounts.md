# 用户账户

## 用户角色

### 管理员

管理员可以访问 Hub 中的额外链接，例如备份、SMTP 设置等。

创建的第一个用户会自动设置为管理员，并拥有一个与邮箱和密码相同的 PocketBase 超级用户账户。

::: tip PocketBase 超级用户与 Beszel 用户角色是独立的
将用户角色更改为管理员并不会创建 PocketBase 超级用户账户。如果您希望他们访问 PocketBase 管理面板，必须手动创建超级用户账户。
:::

### 普通用户

普通用户可以创建自己的系统和警报。Hub 中不会显示 PocketBase 设置的链接。

### 只读用户

只读用户无法创建系统，但可以查看管理员与他们共享的任何系统并创建警报。

## 重置密码

要重置密码，您可以使用 `superusers` 命令。`upsert` 会重置您的密码，或者如果不存在与您邮箱匹配的超级用户，则会创建一个新的超级用户。

进入 PocketBase 后，您可以在用户表中更改用户密码。

### Docker

```bash
docker exec beszel /beszel superuser upsert name@example.com password
```

查看所有超级用户选项：

```bash
docker exec beszel /beszel superuser --help
```

### 二进制文件

```bash
./beszel superuser upsert name@example.com password
```

查看所有超级用户选项：

```bash
./beszel superuser --help
```
