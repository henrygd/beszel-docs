---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

title: Home

hero:
  name: 'Beszel'
  text: 轻量级服务器监控
  tagline: 支持 Docker 统计数据、历史数据和告警功能
  actions:
    - theme: brand
      text: 什么是 Beszel？
      link: /zh/guide/what-is-beszel
    - theme: alt
      text: 安装指南
      link: /zh/guide/getting-started
  image:
    src: https://assets.henrygd.me/beszel/captures/dashboard.png
    alt: 仪表盘截图
    width: 1423
    height: 873

features:
  - title: 轻量级
    details: 比其他解决方案更小、更省资源
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#91d7e3" stroke-linecap="round" stroke-linejoin="round" d="M1.5 5.5H6a2 2 0 1 0-2-2m-2.5 5H12A2.5 2.5 0 1 0 9.5 6m-2 7A1.5 1.5 0 1 0 9 11.5H5.5m-4 0h2"/></svg>
  - title: 简单
    details: 易于设置，无需暴露于公网
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#eed49f" stroke-linecap="round" stroke-linejoin="round" d="M2.85 9.301a.644.65 0 0 1-.502-1.06L8.72 1.605a.322.325 0 0 1 .554.3L8.039 5.82a.644.65 0 0 0 .605.878h4.506a.644.65 0 0 1 .502 1.06L7.28 14.395a.322.325 0 0 1-.554-.3l1.236-3.916a.644.65 0 0 0-.605-.878Z"/></svg>
  - title: Docker stats
    details: 追踪每个容器的 CPU、内存和网络使用历史
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#8aadf4" stroke-linecap="round" stroke-linejoin="round" d="M.5 8.5H11l.75-.5a5.35 5.35 0 0 1 0-3.5c1 .6 1 1.88 1.74 2c.77-.09 1.23.01 2 .52c0 0-.97 1.77-2.5 1.98c-1.93 3.65-4.5 5.5-6.98 5.5C0 14.5.5 8.5.5 8.5m1 0v-2m0 0h8m-6 2v-4m0 0h4m-2-2h2m-2 6v-6m2 6v-6m2 6v-2"/></svg>
  - title: 告警功能
    details: 可配置的 CPU、内存、磁盘、带宽、温度和系统状态告警
    icon: <svg width="32" height="32" viewBox="0 0 24 24"><path fill="#f5a97f" d="M5 19q-.4 0-.7-.3T4 18t.3-.7.7-.3h1v-7q0-2 1.3-3.7t3.2-2.1v-.7q0-.6.4-1T12 2t1 .4.5 1.1v.7q2 .5 3.3 2.1T18 10v7h1q.4 0 .7.3t.3.7-.3.7-.7.3zm7 3q-.8 0-1.4-.6T10 20h4q0 .8-.6 1.4T12 22m-4-5h8v-7q0-1.6-1.2-2.8T12 6 9.2 7.2 8 10zm-5-7q-.4 0-.7-.3T2 8.9q.2-1.8 1-3.5t2.2-2.8q.3-.2.7-.2t.7.4.2.7-.4.7q-1 1-1.6 2.2T4.1 9q0 .4-.4.7T3 10m18 0q-.4 0-.7-.3t-.4-.7q-.2-1.4-.8-2.6t-1.6-2.2q-.3-.3-.4-.7t.2-.8.7-.3.7.2Q20 3.8 21 5.4t1 3.5q.1.4-.2.8t-.7.3"/></svg>
  - title: 多用户
    details: 每个用户管理自己的系统。管理员可以跨用户共享系统
    icon: <svg width="32" height="32" viewBox="0 0 256 256"><path fill="#f5bde6" d="M244.8 150.4a8 8 0 0 1-11.2-1.6A51.6 51.6 0 0 0 192 128a8 8 0 0 1-7.4-4.9 8 8 0 0 1 0-6.2 8 8 0 0 1 7.4-4.9 24 24 0 1 0-23.2-30 8 8 0 1 1-15.5-4 40 40 0 1 1 65.7 39.5 68 68 0 0 1 27.4 21.7 8 8 0 0 1-1.6 11.2M190.9 212a8 8 0 1 1-13.8 8 57 57 0 0 0-98.2 0 8 8 0 1 1-13.8-8 72 72 0 0 1 33.7-30 48 48 0 1 1 58.4 0 72 72 0 0 1 33.7 30M128 176a32 32 0 1 0-32-32 32 32 0 0 0 32 32m-56-56a8 8 0 0 0-8-8 24 24 0 1 1 23.2-30 8 8 0 1 0 15.5-4A40 40 0 1 0 37 117.5a68 68 0 0 0-27.4 21.7 8 8 0 1 0 12.8 9.6A51.6 51.6 0 0 1 64 128a8 8 0 0 0 8-8"/></svg>
  - title: OAuth / OIDC
    details: 支持多个 OAuth2 提供商。可以禁用密码认证
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><g fill="none" stroke="#cad3f5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10.5a4.5 4.5 0 1 0-4.02-2.48L1.5 12.5v2h2v-2h2v-2h2l.48-.48c.6.3 1.3.48 2.02.48"/><path d="M12 5a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1"/></g></svg>
  - title: 自动备份
    details: 从磁盘或兼容 S3 的存储保存和恢复数据
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#a6da95" stroke-linecap="round" stroke-linejoin="round" d="M8 6.5c3.59 0 6.5-1.4 6.5-2.68S11.59 1.5 8 1.5S1.5 2.54 1.5 3.82S4.41 6.5 8 6.5M14.5 8c0 .83-1.24 1.79-3.25 2.2s-4.49.41-6.5 0S1.5 8.83 1.5 8m13 4.18c0 .83-1.24 1.6-3.25 2c-2.01.42-4.49.42-6.5 0c-2.01-.4-3.25-1.17-3.25-2m0-8.3v8.3m13-8.3v8.3"/></svg>
  - title: REST API
    details: 在您自己的脚本和应用程序中使用或更新数据
    icon: <svg width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="#c6a0f6" stroke-linecap="round" stroke-linejoin="round" d="M5.5 12.5a2 2 0 1 1-4 0a2 2 0 0 1 4 0m9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-4.5-9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-6.5 7l3-5.5m3 0l3 5.5"/></svg>
---
