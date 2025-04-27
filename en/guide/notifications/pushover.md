# Pushover

## URL Format

<span class="bk">pushover://shoutrrr:**`apiToken`**@**`userKey`**/?devices=**`device1`**[,__`device2`__, ...]</span>

## URL Fields

- **Token** - API Token/Key (Required)<br>
  URL part: <code>pushover://:<strong>token</strong>@user/</code>

- **User** - User Key (Required)<br>
  URL part: <code>pushover://:token@<strong>user</strong>/</code>

## Query/Param Props

Props can be supplied through URL query params: `?key=value&key=value` etc.

- **Devices**<br>
  Default: empty

- **Priority**<br>
  Default: 0

- **Title**<br>
  Default: empty

## Getting the keys from Pushover

At your [Pushover dashboard](https://pushover.net/) you can view your **`userKey`** in the top right.

<a href="/image/pushover/po-1.png" target="_blank">
   <img src="/image/pushover/po-1.png" alt="Screenshot 1: Pushover dashboard" />
</a>

The `Name` column of the device list is what is used to refer to your devices (**`device1`** etc.)

<a href="/image/pushover/po-4.png" target="_blank">
   <img src="/image/pushover/po-4.png" alt="Screenshot 4: Pushover dashboard" />
</a>

At the bottom of the same page there are links your _applications_, where you can find your **`apiToken`**

<a href="/image/pushover/po-2.png" target="_blank">
   <img src="/image/pushover/po-2.png" alt="Screenshot 2: Pushover dashboard" />
</a>

The **`apiToken`** is displayed at the top of the application page.

<a href="/image/pushover/po-3.png" target="_blank">
   <img src="/image/pushover/po-3.png" alt="Screenshot 3: Pushover dashboard" />
</a>

## Optional parameters

You can optionally specify the **`priority`** parameter in the URL:

<span class="bk">pushover://shoutrrr:**`token`**@**`userKey`**/?devices=**`device`**&**`priority`**=1</span>

::: tip Important
Only supply priority values between -1 and 1, since 2 requires additional parameters that are not supported yet.
:::

Please refer to the [Pushover API documentation](https://pushover.net/api#messages) for more information.
