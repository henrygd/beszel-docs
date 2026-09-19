# Signalgrid

<https://signalgrid.co/>

<https://shoutrrr.nickfedor.com/services/push/signalgrid/>

## URL Format

<span class="bk">signalgrid://**`clientKey`**@**`channel`**</span>

## URL Fields

- **ClientKey** - Signalgrid client key (**Required**)<br>
  URL part: <code class="service-url">signalgrid://<strong>clientKey</strong>@channel</code>

- **Channel** - Signalgrid channel token (**Required**)<br>
  URL part: <code class="service-url">signalgrid://clientKey@<strong>channel</strong></code>

## Query Parameters

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Title**<br>
  Default: empty

- **Type**<br>
  Default: `INFO`<br>
  Options: `CRIT`, `WARN`, `INFO`, `SUCCESS`

- **Critical**<br>
  Default: ❌ `No`

## Examples

::: tip Common usage
<span class="bk">signalgrid://**`clientKey`**@**`channel`**</span>
:::

::: tip Critical notification
<span class="bk">signalgrid://**`clientKey`**@**`channel`**?type=CRIT&critical=true</span>
:::
