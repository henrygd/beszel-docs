# Signalgrid

<https://signalgrid.co/>

<https://shoutrrr.nickfedor.com/services/push/signalgrid/>

## URL 格式

<span class="bk">signalgrid://**`clientKey`**@**`channel`**</span>

## URL 字段

- **ClientKey** - Signalgrid 客户端密钥（**必需**）<br>
  URL 部分: <code class="service-url">signalgrid://<strong>clientKey</strong>@channel</code>

- **Channel** - Signalgrid 频道令牌（**必需**）<br>
  URL 部分: <code class="service-url">signalgrid://clientKey@<strong>channel</strong></code>

## 查询参数

参数可以通过 URL 查询参数提供：`?key=value&key=value` 等。

- **Title**<br>
  默认值：空

- **Type**<br>
  默认值：`INFO`<br>
  可选值：`CRIT`、`WARN`、`INFO`、`SUCCESS`

- **Critical**<br>
  默认值：❌ `No`

## 示例

::: tip 常见用法
<span class="bk">signalgrid://**`clientKey`**@**`channel`**</span>
:::

::: tip 严重通知
<span class="bk">signalgrid://**`clientKey`**@**`channel`**?type=CRIT&critical=true</span>
:::
