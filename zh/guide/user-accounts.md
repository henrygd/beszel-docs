# 用户账户

## 管理员 `admin`

管理员可以访问中心 (hub) 中的其他链接，例如备份、SMTP 设置等。

创建的第一个用户会自动设置为管理员，并拥有使用相同电子邮件和密码的 PocketBase 超级用户帐户。

::: tip 提示
PocketBase 超级用户与 Beszel 用户角色是分开的
将用户的角色更改为管理员不会创建 PocketBase 超级用户帐户。如果您想允许他们访问 PocketBase 管理面板，则必须手动创建一个超级用户帐户。
:::

## 用户 `user`

用户可以创建自己的系统和警报。中心 (hub) 中不显示 PocketBase 设置的链接。

## 只读 `readonly`

只读用户无法创建系统，但可以查看管理员与他们共享的任何系统并创建警报。

## 重置密码

要重置密码，可以使用 `superusers` 命令。`upsert` 选项会重置您的密码，或者如果没有与您的电子邮件对应的超级用户账户，会创建一个新的超级用户。

请确保挂载您的数据目录。

```bash
docker run --rm -v ./beszel_data:/beszel_data henrygd/beszel superuser upsert user@example.com password
```

查看所有超级用户选项
```bash
docker run --rm -v ./beszel_data:/beszel_data henrygd/beszel superuser --help
```