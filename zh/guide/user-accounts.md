# 用户账户

Beszel 使用 PocketBase 进行用户管理。请务必了解，**普通用户账户**和 **PocketBase 超级用户账户**是完全独立的。

在设置过程中，系统会为初始用户同时创建这两种账户。但是，它们存储在不同的集合（collections）中。更新 `user` 账户的邮箱或密码不会同时更新 `superuser` 凭据，反之亦然。

## 用户角色

### 管理员

管理员可以访问 Hub 中的额外链接，例如备份、SMTP 设置等。

> 将用户的角色更改为管理员并不会创建超级用户账户。如果您想允许用户访问 PocketBase 管理面板 (`/_/`)，您必须手动为他们创建超级用户账户。

### 普通用户

普通用户可以创建自己的系统和警报。Hub 中不会显示 PocketBase 设置的链接。

### 只读用户

只读用户无法创建系统，但可以查看管理员与他们共享的任何系统并创建警报。

## 重置密码

如果您丢失了账户访问权限，可以使用 `superuser` CLI 命令重置您的超级用户密码。登录 PocketBase 管理面板 (`/_/`) 后，您可以在 `users` 集合中更新任何用户（包括您自己的 Hub 账户）的密码。

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

## 与多个用户共享系统

要与多个用户共享系统，请在 PocketBase 中更新系统记录以包含用户 (`/_/#/collections?collection=systems`)。

如果您有许多系统或用户，这可能是一项繁琐的任务，但您可以[使用 API 自动化此过程](rest-api#将用户添加到系统)。

未来可能会添加用户组功能，以使此过程更加简便。

或者，您可以使用 `SHARE_ALL_SYSTEMS` 环境变量将所有系统共享给所有用户。