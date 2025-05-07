# Teams

::: warning New webhook URL format only

Shoutrrr now only supports the new Teams webhook URL format with an organization-specific domain.

You must specify your organization domain using:

<span class="bk">?host=example.webhook.office.com</span>

Where `example` is your organization's short name.

Legacy webhook formats (e.g., `outlook.office.com`) are no longer supported.

:::

## URL Format

<span class="bk">teams://<strong><code>group</code></strong>@<strong><code>tenant</code></strong>/<strong><code>altId</code></strong>/<strong><code>groupOwner</code></strong>/<strong><code>extraId</code></strong>?<strong><code>host</code></strong>=<strong><code>organization</code></strong>.webhook.office.com[&<strong><code>color</code></strong>=color]</span>

Where:

- `group`: The first UUID component from the webhook URL.
- `tenant`: The second UUID component from the webhook URL.
- `altId`: The third component (hex string) from the webhook URL.
- `groupOwner`: The fourth UUID component from the webhook URL.
- `extraId`: The fifth component at the end of the webhook URL.
- `organization`: Your organization name for the webhook domain (required).
- `color`: Optional hex color code for the message card (e.g., `FF0000` for red).

## Setting up a webhook

To use the Microsoft Teams notification service, you need to set up a custom incoming webhook. Follow the instructions in [this Microsoft guide](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook#create-an-incoming-webhook).

## Extracting the token

The token is extracted from your webhook URL:

<span class="bk">https://<b>&lt;organization&gt;</b>.webhook.office.com/webhookb2/<b>&lt;group&gt;</b>@<b>&lt;tenant&gt;</b>/IncomingWebhook/<b>&lt;altId&gt;</b>/<b>&lt;groupOwner&gt;</b>/<b>&lt;extraId&gt;</b></span>

All parts of the webhook URL are required:

- `organization`: Your organization name (e.g., `contoso`).
- `group`: First UUID component.
- `tenant`: Second UUID component.
- `altId`: Third component (hex string).
- `groupOwner`: Fourth UUID component.
- `extraId`: Fifth component.

## Example

```ini
# Original webhook URL:
https://contoso.webhook.office.com/webhookb2/11111111-4444-4444-8444-cccccccccccc@22222222-4444-4444-8444-cccccccccccc/IncomingWebhook/33333333012222222222333333333344/44444444-4444-4444-8444-cccccccccccc/V2ESyij_gAljSoUQHvZoZYzlpAoAXExyOl26dlf1xHEx05

# Shoutrrr URL:
teams://11111111-4444-4444-8444-cccccccccccc@22222222-4444-4444-8444-cccccccccccc/33333333012222222222333333333344/44444444-4444-4444-8444-cccccccccccc/V2ESyij_gAljSoUQHvZoZYzlpAoAXExyOl26dlf1xHEx05?host=contoso.webhook.office.com&color=FF0000
```

In this example `color=FF0000` sets a red theme.
