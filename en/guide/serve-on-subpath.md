# Serve on subpath

Beszel can be served on a subpath by setting the `APP_URL` environment variable and using a reverse proxy to forward requests to the subpath.

## Example configurations

```bash
APP_URL=https://beszel.example.com/base-path
```

### Caddy

```text
beszel.example.com {
	request_body {
		max_size 10MB
	}
	handle_path /base-path* {
		reverse_proxy 127.0.0.1:8090 {
			transport http {
				read_timeout 360s
			}
		}
	}
	respond 404
}
```

### Nginx

```nginx
server {
	listen 80;
	server_name beszel.example.com;
	client_max_body_size 10M;

	location /base-path {
		# check http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive
		proxy_set_header Connection '';
		proxy_http_version 1.1;
		proxy_read_timeout 360s;

		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;

		rewrite /base-path/(.*) /$1  break;

		proxy_pass http://127.0.0.1:8090;
	}
}
```
