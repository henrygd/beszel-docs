# Twilio

<https://shoutrrr.nickfedor.com/services/sms/twilio/>

## URL Format

<span class="bk">twilio://**`accountSID`**:**`authToken`**@**`fromNumber`**/**`toNumber`**[/**`toNumber2`**/...]</span>

## URL Fields

- **AccountSID** - Twilio Account SID (**Required**)  
  URL part: <code class="service-url">twilio://<strong>accountsid</strong>:authtoken@fromnumber/tonumbers/</code>
- **AuthToken** - Twilio Auth Token (**Required**)  
  URL part: <code class="service-url">twilio://accountsid:<strong>authtoken</strong>@fromnumber/tonumbers/</code>
- **FromNumber** - Sender phone number or Messaging Service SID (**Required**)  
  URL part: <code class="service-url">twilio://accountsid:authtoken@<strong>fromnumber</strong>/tonumbers/</code>
- **ToNumbers** - Recipient phone number(s) (**Required**)  
  URL part: <code class="service-url">twilio://accountsid:authtoken@fromnumber/<strong>tonumbers</strong>/</code>

## Getting Started

To use the Twilio SMS service, you need a Twilio account. You can sign up at [twilio.com](https://www.twilio.com/).

### Required Credentials

1. **Account SID** — Found on your [Twilio Console Dashboard](https://console.twilio.com/)
2. **Auth Token** — Found on your [Twilio Console Dashboard](https://console.twilio.com/)
3. **From Number** — A Twilio phone number **or** Messaging Service SID from your account
4. **To Number(s)** — One or more recipient phone numbers in [E.164 format](https://www.twilio.com/docs/glossary/what-e164)

### Phone Number Format

Phone numbers should be in [E.164 format](https://www.twilio.com/docs/glossary/what-e164) (e.g. `+15551234567`). Common formatting characters such as spaces, dashes, parentheses, and dots are automatically stripped, so `+1 (555) 123-4567` and `+1.555.123.4567` are also accepted.

### Multiple Recipients

You can send the same message to multiple recipients by adding additional phone numbers to the URL path:

`twilio://ACXX...XX:token@+15551234567/+15559876543/+15551111111/+15552222222`

Each recipient receives an independent API call. If delivery fails for one recipient, the remaining recipients are still attempted and all errors are returned together.

### Messaging Service SID

Instead of a phone number, you can use a [Twilio Messaging Service SID](https://www.twilio.com/docs/messaging/services) as the sender. Messaging Service SIDs start with `MG`:

`twilio://ACXX...XX:token@MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/+15559876543`

This is useful when you want Twilio to manage sender selection, opt-out handling, or when sending from a pool of numbers.
