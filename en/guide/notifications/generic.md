# Generic webhook

The Generic service can be used for any target that is not explicitly supported by Shoutrrr, as long as it supports receiving the message via a `POST` request.

Sometimes this requires customization on the receiving end to interpret the payload, or use of an intermediate proxy to modify the payload.

## URL Format

<span class="bk">generic://example.com</span>

## Custom headers

You can add additional HTTP headers to your request by adding query variables prefixed with `@` (`@key=value`).

Using

<span class="bk">generic://example.com?@acceptLanguage=tlh-Piqd</span>

would result in the additional header being added:

```http
Accept-Language: tlh-Piqd
```

## JSON template

By using the built in `JSON` template (`template=json`) you can create a generic JSON payload.

### Example

```json
{
	"title": "Foo CPU above threshold",
	"message": "CPU averaged 63.53% for the previous 10 minutes."
}
```

### Modifying default keys

The keys used for `title` and `message` can be overriden by supplying the params/query values `titlekey` and `messagekey`.

<span class="bk">generic://example.com?template=json&titlekey=subject&messagekey=content</span>

```json
{
	"subject": "Foo CPU above threshold",
	"content": "CPU averaged 63.53% for the previous 10 minutes."
}
```

## Custom data fields

When using the JSON template, you can add additional key/value pairs to the JSON object by adding query variables prefixed with `$` (`$key=value`).

### Example

Using `generic://example.com?template=json&$free=palestine` would yield:

```json
{
	"title": "Foo CPU above threshold",
	"message": "CPU averaged 63.53% for the previous 10 minutes.",
	"free": "palestine"
}
```

## Forwarded query variables

All query variables that are not listed in the [Query/Param Props](#queryparam_props) section will be
forwarded to the target endpoint.

If you need to pass a query variable that _is_ reserved, you can prefix it with an underscore (`_`).

### Example

The URL `generic://example.com/api/v1/postStuff?contenttype=text/plain` would send a POST message
to `https://example.com/api/v1/postStuff` using the `Content-Type: text/plain` header.

If instead escaped, `generic://example.com/api/v1/postStuff?_contenttype=text/plain` would send a POST message
to `https://example.com/api/v1/postStuff?contenttype=text/plain` using the `Content-Type: application/json` header (as it's the default).

## Query/Param Props

Props can be either supplied using the params argument, or through the URL using  
`?key=value&key=value` etc.

- **ContentType** - The value of the Content-Type header  
  Default: `application/json`

- **DisableTLS**  
  Default: ❌ `No`

- **MessageKey** - The key that will be used for the message value  
  Default: `message`

- **RequestMethod**  
  Default: `POST`

- **Template** - The template used for creating the request payload  
  Default: _empty_

- **TitleKey** - The key that will be used for the title value  
  Default: `title`
