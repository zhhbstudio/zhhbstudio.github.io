---
title: 创建我的博客
date: 2020-12-01 21:30:00 +0800
categories: [blog, docker]
tags: [jekyll,blog]
---

# 创建我的博客

## 为什么创建博客

别人都有个博客，记录一些内容，我也想记录一下我的东西。

## 为什么选择 Jekyll

一个 朋友 用的这个，并且 Github 只支持这个动态框架，这样就不需要打包后再提交到 Github，直接推送编辑好的 Markdown 文件就行了。

## 为什么选择 Chirpy

那个朋友用的 [vno-jekyll](https://github.com/onevcat/vno-jekyll)，但是那个主题是旧的 Jekyll，我在本地跑的时候好多问题，然后我通过 vno-jekyll 的作者找到了这个主题，跟那个风格很像，所以就下载了这个源代码，在本地跑起来还不错。

## 怎么创建的

有洁癖的人什么都要处理一下……

为了能避免上传到 Github 出现问题，我在本地通过 Docker 部署了一套环境。

### Docker 容器
``` bash
# 使用 centos:7 镜像创建容器
docker run --privileged -itd --name blog -h blog -v ~/blog:/blog -p 38322:38322   centos:7 /usr/sbin/init

# 进入容器 
docker exec -it blog bash

# 因为要使用高于 2.5.0 版本的 ruby，但 yum 的是 2.0.0 版本，所以要使用 rvm 安装高版本。
# [rvm](http://rvm.io/) 经测试，不要求先安装低版本 ruby
# rvm 安装要用到 which 但是默认 centos 7 镜像不带，所以先安装
yum install which

# ！下边这句可以先跳过
# 安装 GPG keys，官网也提供了相应的命令，但是我用了好像没生效，再运行下一句时提醒了用这句
gpg2 --keyserver hkp://pool.sks-keyservers.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

# 安装 rvm，你也可以先运行这句，确认一下上边那个 key 是否变化，我没深入研究
\curl -sSL https://get.rvm.io | bash -s stable

# 根据提示，应用 /etc/profile.d/rvm.sh
source /etc/profile.d/rvm.sh

# 查看可安装版本
rvm list known

# 安装 2.7.0 版本 可简写 rvm install 2.7，linux 里 [] 中间的东西都是可以不写的
rvm install ruby-2.7.0

# 查看 ruby 版本
ruby -v

# 安装工具
gem install bundler

# 可根据需要安装 git 等。
```
### 使用主题

下载最新版本代码，我有洁癖，通过 Github 下载的 zip 包。解压后放到容器内 blog 文件夹。然后根据 [指引](https://chirpy.cotes.info/posts/getting-started/) 使用脚本 `bash tools/init.sh --no-gh` 初始化。然后通过 `bundle install` 安装项目依赖。最后通过 `bundle exec jekyll s` 它就在本地 4000 端口跑起来了。


### 插件
github pages 仅支持以下插件，所以本博客的 `分类、标签` 不可用

* jekyll-coffeescript
* jekyll-default-layout
* jekyll-gist
* jekyll-github-metadata
* jekyll-optional-front-matter
* jekyll-paginate
* jekyll-readme-index
* jekyll-titles-from-headings
* jekyll-relative-links

不过看到 [有人](https://github.com/jinyb09017/jinyb09017.github.io) 的能实现，大概看了一下，还没做。

### 后续

做了一些“汉化”，就是简单的将一些英文换为中文而已……

## 计划

* 更完整的汉化
* 滚动条的美化
* 朋友博客的自动换肤功能的移植
* 更多……
