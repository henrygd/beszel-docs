# User Accounts

Beszel uses PocketBase for user management. It is important to understand that **regular user accounts** and **PocketBase superuser accounts** are entirely separate.

Both accounts are created for the initial user during setup. However, these are stored in different collections. Updating the email or password for your `user` account will not update the `superuser` credentials, and vice versa.

## User roles

### Admin

Admins have access to additional links in the Hub, such as backups, SMTP settings, etc.

> Changing a user's role to admin does not create a superuser account. If you want to allow a user to access the PocketBase admin panel (`/_/`), you must create a superuser account for them manually.

### User

Users can create their own systems and alerts. Links to PocketBase settings are not shown in the hub.

### Read only

Read-only users cannot create systems but can view any system shared with them by an admin and create alerts.

## Reset password

If you lose access to your account, you can use the `superuser` CLI command to reset your superuser password. 
This will only update your PocketBase login password. It will not affect your hub login.

::: tip
Once logged into the PocketBase admin panel (`/_/`), you can update passwords for any user (including your own Hub account) in the `users` collection.
:::

### Docker

```bash
docker exec beszel /beszel superuser upsert name@example.com password
```

See all superuser options:

```bash
docker exec beszel /beszel superuser --help
```

### Binary

```bash
./beszel superuser upsert name@example.com password
```

See all superuser options:

```bash
./beszel superuser --help
```

## Sharing systems with multiple users

To share a system with other users, add them to the system record in PocketBase.
1.	Go to the systems collection (/_/#/collections?collection=systems)
2.	Open the system you’d like to share
3.	Click Open picker in the users field
4.	Choose the user(s) you want to share the system with

This can be a labor intensive task if you have many systems or users, however you can [use the API to automate this process](rest-api#adding-users-to-systems).

User groups may be added in the future to make this process easier.

Alternatively, you can use the `SHARE_ALL_SYSTEMS` environment variable to share all systems with all users.