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

如果你无法访问你的账户，可以使用 `superuser CLI` 命令来重置你的超级用户密码。
这只会更新你用于登录 PocketBase 的密码，不会影响你登录 Hub 的密码。

::: tip
成功登录 PocketBase 管理面板 `（/_/）`后，你可以在 `users` 集合中更新任意用户的密码（包括你自己的 Hub 账户）。
:::

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

要将一个系统共享给多个用户，请在 PocketBase 中更新该系统记录并添加用户。
1.	打开 systems 集合（/_/#/collections?collection=systems）
2.	打开你想要共享的系统
3.	在 users 字段中点击 Open picker
4.	选择要共享该系统的用户

如果您有许多系统或用户，这可能是一项繁琐的任务，但您可以[使用 API 自动化此过程](rest-api#将用户添加到系统)。

未来可能会添加用户组功能，以使此过程更加简便。

或者，您可以使用 `SHARE_ALL_SYSTEMS` 环境变量将所有系统共享给所有用户。