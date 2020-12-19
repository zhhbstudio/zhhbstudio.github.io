---
title: go：获取真实的路径
date: 2020-12-19 21:30:00 +0800
categories: [go, debug]
tags: [go]
---

# go：获取真实的路径

## 需求

在学习 go 的时候，遇到一个问题，本地开发时测试能正常使用，但是放到其他位置后，读取配置文件的路径还是开发环境的路径。

## 查找原因

经过仔细研读同事代码，发现在读取配置文件时，使用 `runtime.Caller(1)` 获取的文件位置，但 [`golang` 官方文档](https://golang.org/pkg/runtime/#Caller) 给出的函数说明如下：

> func Caller(skip int) (pc uintptr, file string, line int, ok bool)
> Caller reports file and line number information about function invocations on the calling goroutine's stack. The argument skip is the number of stack frames to ascend, with 0 identifying the caller of Caller. (For historical reasons the meaning of skip differs between Caller and Callers.) The return values report the program counter, file name, and line number within the file of the corresponding call. The boolean ok is false if it was not possible to recover the information.

经过实际测试，这个函数返回的第二个值 `file` 的是你打包的代码的位置，并非运行时调用的文件的位置。因此，使用测函数获取的文件位置还是打包时的文件位置，而不是运行时的文件位置。

## 深入分析

其实，造成这个问题的主要原因在于，在使用 `go run` 命令的时候，会打一个临时二进制包，放在 `/tmp/go-build……` 目录下，此时的执行位置是 `/tmp/` 路径下，并不在项目目录下，所以使用相对路径取不到位于项目目录下的配值文件。  
而使用 `runtime.Caller` 又恰好能取到项目目录下的调用方的文件的位置，所以能以相对路径的方式取到配置文件。  
因此，当你打包之后，移动到其他位置、机器后，因为没有源代码路径，或路径不一致，所以取不到配置文件。

## 解决方案

### 方案1
使用传参的形式将配置文件的路径传进去

### 方案2
多层判断

### 方案3
配置环境变量

参考文章中提到的 [`beego`](https://github.com/astaxie/beego/blob/master/config.go#L138-L164) 已经使用`方案2`、`方案3`结合的形式获取配置文件了。


> 参考：[聊一聊，Golang “相对”路径问题](https://segmentfault.com/a/1190000013685370)
