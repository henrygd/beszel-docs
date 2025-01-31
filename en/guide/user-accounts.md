# User Accounts

## User roles

### Admin

Admins have access to additional links in the hub, such as backups, SMTP settings, etc.

The first user created is automatically set to admin and has a PocketBase superuser account with the same email and password.

::: tip PocketBase superusers are separate from Beszel user roles
Changing a user's role to admin does not create a PocketBase superuser account. If you want to allow them to access the PocketBase admin panel, you must create a superuser account manually.
:::

### User

Users can create their own systems and alerts. Links to PocketBase settings are not shown in the hub.

### Read only

Read-only users cannot create systems but can view any system shared with them by an admin and create alerts.

## Reset password

For resetting your password you can use the `superusers` command. Upsert will reset your password or create a new superuser if an existing one with your email doesn't exist.

Once you are in PocketBase you can change user passwords in the users table.

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
