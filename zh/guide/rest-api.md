# REST API

由于 Beszel 基于 PocketBase 构建，您可以使用 PocketBase [Web API](https://pocketbase.io/docs/api-records/) 和 [客户端 SDK](https://pocketbase.io/docs/client-side-sdks/) 来读取或更新 Beszel 自身之外的数据。

::: warning API 稳定性
目前，API 返回的数据结构和内容可能会在次要版本更新中发生变化。

我们会在发布说明中记录这些更改，并尽可能提前通知。
:::

## 基本示例

此示例使用 [PocketBase JS SDK](https://github.com/pocketbase/js-sdk) 从 `systems` 集合中读取数据。

```typescript
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

// 作为普通用户进行身份验证
const userData = await pb.collection('users').authWithPassword('test@example.com', '123456')

// 列出并过滤系统记录
const systems = await pb.collection('systems').getList(1, 20, {
 filter: 'status = "up" && created > "2024-06-01 10:00:00"',
})

console.log(systems)
```

## 将用户添加到系统

此示例将特定用户添加到特定系统。

```ts
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

// 我们将添加到系统的用户
const userEmails = ['user1@example.com', 'user2@example.com']
// 我们将向其添加用户的系统名称
const systemNames = ['localhost', 'kagemusha']

// 作为管理员进行身份验证
await pb.admins.authWithPassword(process.env.EMAIL, process.env.PASSWORD)

// 获取用户 ID
const userIds = await pb
 .collection('users')
 .getFullList({
  fields: 'id',
  filter: `email='${userEmails.join(`'||email='`)}'`,
 })
 .then((records) => records.map(({ id }) => id))

// 获取系统 ID 和当前用户
const systemsData = await pb.collection('systems').getFullList({
 fields: 'id,users',
 filter: `name='${systemNames.join(`'||name='`)}'`,
})

// 循环遍历系统并将用户添加到其中
for (const system of systemsData) {
 const updatedUsers = Array.from(new Set([...system.users, ...userIds]))
 await pb.collection('systems').update(system.id, { users: updatedUsers })
}
```
