# Google Chat

## URL Format

Your Google Chat Incoming Webhook URL will look like this:

<span class="bk">http<span>s://chat.</span>googleapis.com/v1/spaces/**`FOO`**/messages?key=**`bar`**&token=**`baz`**</span>

The shoutrrr service URL should look like this:

<span class="bk">googlechat://chat.googleapis.com/v1/spaces/**`FOO`**/messages?key=**`bar`**&token=**`baz`**</span>

In other words the incoming webhook URL with `https` replaced by `googlechat`.

Google Chat was previously known as Hangouts Chat. Using `hangouts` in the service URL instead `googlechat` is still supported, although deprecated.

## Creating an incoming webhook in Google Chat

1. Open the room you would like to add Shoutrrr to and open the chat room menu.

<a href="/image/googlechat/hangouts-1.png" target="_blank">
   <img src="/image/googlechat/hangouts-1.png" alt="Screenshot 1: Open the chat room menu" />
</a>

2. Then click on _Configure webhooks_.

<a href="/image/googlechat/hangouts-2.png" target="_blank">
   <img src="/image/googlechat/hangouts-2.png" alt="Screenshot 2: Click on Configure webhooks" />
</a>

3. Name the webhook and save.

<a href="/image/googlechat/hangouts-3.png" target="_blank">
   <img src="/image/googlechat/hangouts-3.png" alt="Screenshot 3: Name the webhook and save" />
</a>

4. Copy the URL.

<a href="/image/googlechat/hangouts-4.png" target="_blank">
   <img src="/image/googlechat/hangouts-4.png" alt="Screenshot 4: Copy the webhook URL" />
</a>

5. Format the service URL by replacing `https` with `googlechat`.
