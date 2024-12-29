# Home Assistant 代理

Home Assistant 插件由第三方维护。目前有两个选项：

- `Obamium69/hassio-beszel_agent` ([GitHub](https://github.com/Obamium69/hassio-beszel_agent))
- `matthewhadley/homeassistant-beszel-agent` ([GitHub](https://github.com/matthewhadley/homeassistant-beszel-agent))

## 将仓库添加到 Home Assistant

1. 登录到您的 Home Assistant 实例，然后转到“插件”。

<a href="/image/hass/open-addons.png" target="_blank" style="display: block; margin: 1em 0">
   <img src="/image/hass/open-addons.png" height="411" width="1651" alt="Home Assistant 中的代理插件可见" />
</a>

2. 点击“插件商店”，打开右上角的三点菜单，然后选择“仓库”。

<div style="display: flex; flex-wrap: wrap; gap: 0.7em; margin: 1em 0 1.2em;">
   <a href="/image/hass/open-addonsstore.png" target="_blank">
      <img src="/image/hass/open-addonsstore.png" height="700" width="1099" alt="Home Assistant 中的代理插件可见" />
   </a>
   <a href="/image/hass/add-repo.png" target="_blank">
      <img src="/image/hass/add-repo.png" height="866" width="1121" alt="Home Assistant 中的代理插件可见" />
   </a>
</div>

3. 添加以下仓库之一：

- `https://github.com/Obamium69/hassio-beszel_agent`
- `https://github.com/matthewhadley/homeassistant-beszel-agent`

## 配置插件

1. 插件现在应该出现在插件商店中。只需点击它，然后按下“安装”。

<a href="/image/hass/homeassistant-addon.png" target="_blank">
   <img src="/image/hass/homeassistant-addon.png" height="146" width="554" alt="Home Assistant 中的代理插件可见" />
</a>

2. 插件现已安装。返回已安装插件的概览，打开代理插件，然后切换到“配置”选项卡。
3. 按照[这些](./getting-started.md#_3-configure-your-first-system)说明配置代理，然后复制公钥。
4. 返回 Home Assistant，将公钥粘贴到输入字段中，然后按下“保存”。
5. 启动插件。
