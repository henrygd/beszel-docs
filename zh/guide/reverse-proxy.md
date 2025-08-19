# 反向代理

Beszel 可以在反向代理后面提供服务。反向代理应该配置为代理 WebSocket 连接，以便使用通用令牌设置的代理能够连接到中心。

建议设置 `APP_URL` 环境变量，因为它用于通知链接和代理配置生成。

```dotenv
APP_URL=https://beszel.example.com/base-path-if-applicable
```

## Caddy

```ini
beszel.example.com {
	request_body {
		max_size 10MB
	}
	reverse_proxy 127.0.0.1:8090 {
		transport http {
			read_timeout 360s
		}
	}
}
```

### 使用 Caddy 在子路径提供服务

```dotenv
APP_URL=https://beszel.example.com/base-path
```

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

## Nginx

```nginx
server {
	listen 80;
	server_name beszel.example.com;
	client_max_body_size 10M;

	location / {
		proxy_read_timeout 360s;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";

		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;

		proxy_pass http://127.0.0.1:8090;
	}
}
```

### 使用 Nginx 在子路径提供服务

```dotenv
APP_URL=https://beszel.example.com/base-path
```

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

## Traefik

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
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.beszel.entrypoints=web,websecure"
    - "traefik.http.routers.beszel.rule=Host(`beszel.example.com`)"
    - "traefik.http.routers.beszel.tls=true"
    - "traefik.http.routers.beszel.tls.certresolver=your-cert-resolver"
    - "traefik.http.routers.beszel.tls.domains[0].main=beszel.example.com"
```

### 使用 Traefik 在子路径提供服务

```dotenv
APP_URL=https://beszel.example.com/base-path
```

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
    - APP_URL=https://beszel.example.com/base-path
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.beszel.entrypoints=web,websecure"
    - "traefik.http.routers.beszel.rule=Host(`beszel.example.com`) && PathPrefix(`/base-path`)"
    - "traefik.http.middlewares.strip-beszel.stripprefix.prefixes=/base-path"
    - "traefik.http.routers.beszel.middlewares=strip-beszel@docker"
    - "traefik.http.routers.beszel.tls=true"
    - "traefik.http.routers.beszel.tls.certresolver=your-cert-resolver"
    - "traefik.http.routers.beszel.tls.domains[0].main=beszel.example.com"
```

## Apache

::: tip 启用 Apache2 模块：

```bash
a2enmod proxy proxy_http proxy_wstunnel rewrite
```

:::

```apache
<VirtualHost *:443>
  ServerName beszel.example.com

  ProxyPass / http://localhost:8090/
  ProxyPreserveHost on

  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/?(.*) "ws://localhost:8090/$1" [P,L]

</VirtualHost>
```

### 使用 Apache 在子路径提供服务

```dotenv
APP_URL=https://beszel.example.com/base-path
```

```apache
<VirtualHost *:443>
  ServerName beszel.example.com

  ProxyPass /base-path/ http://localhost:8090/
  ProxyPassReverse /base-path/ http://localhost:8090/
  ProxyPreserveHost on

  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/base-path/(.*) "ws://localhost:8090/$1" [P,L]

</VirtualHost>
```
