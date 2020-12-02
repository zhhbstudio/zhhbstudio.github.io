---
title: Nginx 反向代理重写 URL
date: 2020-12-02 21:30:00 +0800
categories: [linux, nginx]
tags: [nginx]
---

# Nginx 反向代理重写 URL 

## 需求

nginx 服务器代理前端页面，并且反代后端服务器。开发时使用没有什么问题，部署后存在同样请求根地址的情况（当然可以针对一级后端地址写多个配置，但是我懒……）。想起来之前查过这个重写的方案。

## 一般反向代理

一般会定义一个统一前缀，比如：api，则配置如下
```json
server {
    listen              80;
    server_name         default;
    
    location /api {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://example.com;
    }
}
```
则请求到 ```/api/exampleapi``` 时，会转发到 ```http://example.com/api/exampleapi```。

设置proxy_pass即可。请求只会替换域名。

但我的情况是本来打算前后端放在一起，所以 server 那边并没有加 ```api``` 这个前缀。所以要将 ```/api/exampleapi``` 转发到 ```http://example.com/exampleapi```，则可按照如下两种配置。
* 方案一 在 proxy_pass 后增加 ```/``` 则 nginx 会将 ```/api``` 之后的内容拼接到 proxy_pass 之后。
```json
server {
    listen              80;
    server_name         default;
    
    location /api {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        proxy_pass http://example.com/;
    }
}
```
* 方案二 使用 rewrite，注意到 proxy_pas s结尾没有 ```/```， rewrite 重写了 url。
```json
server {
    listen              80;
    server_name         default;
    
    location /api {
        proxy_set_header Host $host;
        proxy_set_header  X-Real-IP        $remote_addr;
        proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
        proxy_set_header X-NginX-Proxy true;

        rewrite ^/api/(.*)$ /$1 break;
        proxy_pass http://example.com;
    }
}
```

关于 rewrite 
```
syntax: rewrite regex replacement [flag]
Default: —
Context: server, location, if
```


> 参考：[Nginx代理proxy pass配置去除前缀](https://www.cnblogs.com/woshimrf/p/nginx-proxy-rewrite-url.html)
