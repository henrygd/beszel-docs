# 在子路径上提供服务

通过设置 `APP_URL` 环境变量并使用反向代理将请求转发到子路径，Beszel 可以在子路径上提供服务。

## 配置示例

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
		# 查看 http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive
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
