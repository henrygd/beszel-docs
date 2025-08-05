# Reverse Proxy

Beszel can be served behind a reverse proxy. The reverse proxy should be configured to proxy WebSocket connections in order for agents setup with a universal token to connect to the hub.

It is advisable to set the `APP_URL` environment variable because it is used for notification links and agent config generation.

## Serve on subpath

The reverse proxy and the `APP_URL` environment variable can be configured to serve Beszel on a subpath.

### Example configurations for subpath

```bash
APP_URL=https://beszel.example.com/base-path
```

#### Caddy

```ini
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

#### Nginx

```nginx
server {
	listen 80;
	server_name beszel.example.com;
	client_max_body_size 10M;

	location /base-path {
		proxy_read_timeout 360s;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";

		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;

		rewrite /base-path/(.*) /$1  break;

		proxy_pass http://127.0.0.1:8090;
	}
}
```

#### Traefik

```yaml
beszel:
  image: henrygd/beszel:latest
  container_name: beszel
  restart: unless-stopped
  volumes:
    - ./beszel_data:/beszel_data
    - ./beszel_socket:/beszel_socket
  networks:
    - traefik-network
  environment:
    - APP_URL=https://${HOSTNAME}/${SUB_PATH}
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.beszel.entrypoints=web,websecure"
    - "traefik.http.routers.beszel.rule=Host(`${HOSTNAME}`) && PathPrefix(`/${SUB_PATH}`)"
    - "traefik.http.middlewares.strip-beszel.stripprefix.prefixes=/beszel"
    - "traefik.http.routers.beszel.middlewares=strip-beszel@docker"
    - "traefik.http.routers.beszel.tls=true"
    - "traefik.http.routers.beszel.tls.certresolver=your-cert-resolver"
    - "traefik.http.routers.beszel.tls.domains[0].main=${HOSTNAME}"
```
