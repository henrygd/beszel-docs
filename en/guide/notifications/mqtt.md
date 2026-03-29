# MQTT

<https://shoutrrr.nickfedor.com/services/push/mqtt/>

## URL Format

The MQTT service supports two URL schemes for connection security:

- **`mqtt://`**: Standard unencrypted connection (port 1883 by default)
- **`mqtts://`**: TLS-encrypted connection (port 8883 by default)

<span class="bk">mqtt://[**`username`**[:**`password`**]@]**`host`**[:**`port`**]/**`topic`**</span>

<span class="bk">mqtts://[**`username`**[:**`password`**]@]**`host`**[:**`port`**]/**`topic`**</span>

## URL Fields

- **Username** - Auth username<br>
  Default: empty<br>
  URL part: <code>mqtt://<strong>username</strong>:password@host:port/topic</code>

- **Password** - Auth password<br>
  Default: empty<br>
  URL part: <code>mqtt://username:<strong>password</strong>@host:port/topic</code>

- **Host** - MQTT broker hostname<br>
  Default: localhost<br>
  URL part: <code>mqtt://username:password@<strong>host</strong>:port/topic</code>

- **Port** - MQTT broker port<br>
  Default: 1883 (mqtt) or 8883 (mqtts)<br>
  URL part: <code>mqtt://username:password@host:<strong>port</strong>/topic</code>

- **Topic** - Target topic name (Required)<br>
  URL part: <code>mqtt://username:password@host:port/<strong>topic</strong></code>

## Query Parameters

- **CleanSession** - Start with a clean session<br>
  Default: ✔ yes

- **ClientID** - MQTT client identifier<br>
  Default: shoutrrr

- **DisableTLS** - Disable TLS encryption<br>
  Default: ❌ no

- **DisableTLSVerification** - Disable TLS certificate verification (useful for self-signed certificates)<br>
  Default: ❌ no

- **QoS** - Quality of Service level (0, 1, or 2)<br>
  Default: 0<br>
  Possible values: 0 (AtMostOnce), 1 (AtLeastOnce), 2 (ExactlyOnce)

::: warning TLS Configuration Options

The following options control TLS behavior:

- **`disabletls`**: When set to `yes`, forces an **unencrypted connection** even if the `mqtts://` scheme is used. This overrides the scheme's implicit TLS requirement.
- **`disabletlsverification`**: When set to `yes`, disables TLS certificate verification while still using encryption. This is useful for self-signed certificates.

:::

::: danger Security Warning: Silent TLS Downgrade
Setting **`disabletls=yes`** with `mqtts://` will force an unencrypted connection despite the secure scheme. This is **likely unexpected behavior** and can cause silent downgrades where you believe traffic is encrypted but it is not.

**Recommendation**: If you intentionally want an unencrypted connection, use `mqtt://` (non-TLS scheme) instead of combining `mqtts://` with `disabletls=yes`.
:::

::: tip When to Use `disabletls=yes`

This option is intended for specific edge cases, such as:

- **TLS-terminating proxy**: When connecting through a proxy that handles TLS termination, where the connection from client-to-proxy uses TLS but proxy-to-broker is plain MQTT. For example, a reverse proxy like Traefik or nginx that terminates TLS and forwards to an internal MQTT broker.
- **Testing environments**: Local development where encryption is not required.

:::

## Examples

### Basic Notification

<span class="bk">mqtt://broker.example.com/notifications</span>

### With Authentication

<span class="bk">mqtt://user:pass@broker.example.com:1883/home/alerts</span>

### Secure Connection

<span class="bk">mqtts://user:pass@broker.example.com:8883/home/alerts</span>

### Home Assistant

<span class="bk">mqtt://homeassistant.local:1883/homeassistant/notification</span>

### Mosquitto broker with custom client ID

<span class="bk">mqtt://mosquitto.example.com:1883/sensors/alerts?clientid=shoutrrr-alerts&qos=2</span>

### Self-signed Certificate

<span class="bk">mqtts://broker.local:8883/secure/alerts?disabletlsverification=yes</span>

### Full Configuration

<span class="bk">mqtts://admin:secret@mqtt.example.com:8883/production/alerts?clientid=prod-shoutrrr&qos=1&retained=yes&cleansession=no</span>
