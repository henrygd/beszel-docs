# WeCom

Send notifications to WeChat Work (Enterprise WeChat) using webhook bots.

## URL Format

<span class="bk">wecom://**`key`**</span>

## Optional Query/Param Props

- **`mentioned_list`** - Users to mention (comma-separated)

- **`mentioned_mobile_list`** - Mobile numbers to mention (comma-separated)

### Example URL

<span class="bk">wecom://**`693axxx6-7aoc-4bc4-97a0-0ec2sifa5aaa`**?**`mentioned_list`**=**`@all`**</span>

## Create a Webhook Bot in WeChat Work

Official Documentation: [Webhook Bot Guide](https://developer.work.weixin.qq.com/document/path/99110)

1. **Create a Group Bot**:
   a. Open WeChat Work on PC or Web.
   b. Find the target group for receiving notifications.
   c. Right-click the group and select "Add Group Bot".
   d. In the dialog, click "Create a Bot".
   e. Enter a custom bot name and click "Add".
   f. You will receive a webhook URL.

2. **Get the Webhook Key**:

   - The webhook URL will look like: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=XXXXXXXXXXXXXXXXXX`
   - The `key` is the value after `?key=` in the URL.

3. **Configure Shoutrrr**:
   - Use the key in the Shoutrrr URL: `wecom://YOUR_WEBHOOK_KEY`
