# REST API

Because Beszel is built on PocketBase, you can use the PocketBase [web APIs](https://pocketbase.io/docs/api-records/) and [client-side SDKs](https://pocketbase.io/docs/client-side-sdks/) to read or update data from outside Beszel itself.

::: warning API Stability
For the time being, the structure and content of data returned by the API may change in minor releases.

We will document these changes in the release notes and provide advanced notice when possible.
:::

## Basic example

This example uses the [PocketBase JS SDK](https://github.com/pocketbase/js-sdk) to read data from the `systems` collection.

```ts
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

// authenticate as regular user
const userData = await pb.collection('users').authWithPassword('test@example.com', '123456')

// list and filter system records
const systems = await pb.collection('systems').getList(1, 20, {
 filter: 'status = "up" && created > "2024-06-01 10:00:00"',
})

console.log(systems)
```

## Adding users to systems

This example adds specific users to specific systems.

```ts
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

// users we will add to systems
const userEmails = ['user1@example.com', 'user2@example.com']
// system names we will add users to
const systemNames = ['localhost', 'kagemusha']

// authenticate as admin
await pb.admins.authWithPassword(process.env.EMAIL, process.env.PASSWORD)

// get user ids
const userIds = await pb
 .collection('users')
 .getFullList({
  fields: 'id',
  filter: `email='${userEmails.join(`'||email='`)}'`,
 })
 .then((records) => records.map(({ id }) => id))

// get id and current users for systems
const systemsData = await pb.collection('systems').getFullList({
 fields: 'id,users',
 filter: `name='${systemNames.join(`'||name='`)}'`,
})

// loop through systems and add users to them
for (const system of systemsData) {
 const updatedUsers = Array.from(new Set([...system.users, ...userIds]))
 await pb.collection('systems').update(system.id, { users: updatedUsers })
}
```
