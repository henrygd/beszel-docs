# Home Assistant Agent

Home Assistant Add-ons are maintained by third parties. Currently there are two options:

- `Obamium69/hassio-beszel_agent` ([GitHub](https://github.com/Obamium69/hassio-beszel_agent))
- `matthewhadley/homeassistant-beszel-agent` ([GitHub](https://github.com/matthewhadley/homeassistant-beszel-agent))

## Add Repo to Home Assistant

1. Log in to your Home Assistant instance and go to "Add-ons".

<a href="/image/hass/open-addons.png" target="_blank" style="display: block; margin: 1em 0">
   <img src="/image/hass/open-addons.png" height="411" width="1651" alt="Agent add-on visible in Home Assistant" />
</a>

2. Click on "ADD-ON STORE", open the three dots, and choose "Repositories".

<div style="display: flex; flex-wrap: wrap; gap: 0.7em; margin: 1em 0 1.2em;">
   <a href="/image/hass/open-addonsstore.png" target="_blank">
      <img src="/image/hass/open-addonsstore.png" height="700" width="1099" alt="Agent add-on visible in Home Assistant" />
   </a>
   <a href="/image/hass/add-repo.png" target="_blank">
      <img src="/image/hass/add-repo.png" height="866" width="1121" alt="Agent add-on visible in Home Assistant" />
   </a>
</div>

3. Add one of the following repositories:

- `https://github.com/Obamium69/hassio-beszel_agent`
- `https://github.com/matthewhadley/homeassistant-beszel-agent`

## Configure Add-on

1. The add-on should now appear in the add-ons store. Just click on it and press "Install".

<a href="/image/hass/homeassistant-addon.png" target="_blank">
   <img src="/image/hass/homeassistant-addon.png" height="146" width="554" alt="Agent add-on visible in Home Assistant" />
</a>

2. The add-on is now installed. Go back to the overview of the currently installed add-ons, open the agent add-on, and switch to the "Configuration" tab.
3. Follow [these](./getting-started.md#_3-configure-your-first-system) instructions to configure the agent, and then copy the public key.
4. Go back to Home Assistant, paste the public key into the input field, and press "SAVE".
5. Start the add-on.
