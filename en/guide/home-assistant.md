# Home Assistant Agent

::: warning
This Home Assistant Addon is in early development, and there could be issues. It is developed by a third party.
:::

## Add Repo to Home Assistant

1. Log in to your Home Assistant instance and go to "Add-ons".
   <a href="/image/open-addons.png" target="_blank">
   <img src="/image/open-addons.png" height="400" width="500" alt="Agent add-on visible in Home Assistant" />
   </a>
2. Click on "ADD-ON STORE", open the three dots, and choose "Repositories".
   <a href="/image/open-addonsstore.png" target="_blank">
   <img src="/image/open-addonsstore.png" height="400" width="450" alt="Agent add-on visible in Home Assistant" />
   </a>
   <a href="/image/add-repo.png" target="_blank">
   <img src="/image/add-repo.png" height="400" width="450" alt="Agent add-on visible in Home Assistant" />
   </a>
3. Add the following repository: `https://github.com/Obamium69/hassio-beszel_agent`

## Configure Add-on

1. The add-on should now appear in the add-ons store. Just click on it and press "Install".
   <a href="/image/homeassistant-addon.png" target="_blank">
   <img src="/image/homeassistant-addon.png" height="400" width="400" alt="Agent add-on visible in Home Assistant" />
   </a>

2. The add-on is now installed. Go back to the overview of the currently installed add-ons, open the agent add-on, and switch to the "Configuration" tab.
3. Follow [these](./getting-started.md#_3-configure-your-first-system) instructions to configure the agent, and then copy the public key.
4. Go back to Home Assistant, paste the public key into the "KEY" input, and press "SAVE".
5. Start the add-on.
