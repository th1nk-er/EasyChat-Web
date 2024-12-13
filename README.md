# EasyChat-Web

![GitLab License](https://img.shields.io/gitlab/license/th1nk-er/EasyChat-Web) ![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/th1nk-er/EasyChat-Web?branch=master) ![vue](https://img.shields.io/badge/vue-3.5.1-brightgreen.svg) ![element-plus](https://img.shields.io/badge/element--plus-2.9.0-brightgreen.svg)

## 介绍

[EasyChat-Web](https://gitlab.com/th1nk-er/EasyChat-Web) 是一个在线聊天室的前端页面，它基于 [vue](https://github.com/vuejs/vue) 和 [element-plus](https://github.com/element-plus/element-plus) 实现，使用 [websocket](https://github.com/stomp-js/stompjs) 进行实时通讯，基本功能已搭建完善。项目后端地址:[EasyChat](https://gitlab.com/th1nk-er/EasyChat)

## 演示

|                            Light                             |                             Dark                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| ![image-20241213191325559](D:\WebProjects\EasyChat-Web\assets\image-20241213191325559.png) | ![image-20241213191347339](D:\WebProjects\EasyChat-Web\assets\image-20241213191347339.png) |
| ![image-20241213191601564](D:\WebProjects\EasyChat-Web\assets\image-20241213191601564.png) | ![image-20241213191528937](D:\WebProjects\EasyChat-Web\assets\image-20241213191528937.png) |

## 部署

你需要在本地安装 [node](https://nodejs.org/) 和 [git](https://git-scm.com/)，本项目技术栈基于 [vue](https://github.com/vuejs/vue) 、[pinia](https://github.com/vuejs/pinia)、[vue-router](https://github.com/vuejs/router)、[axios](https://github.com/axios/axios)、[stompjs](https://github.com/stomp-js/stompjs) 和 [element-plus](https://github.com/element-plus/element-plus)。

### 本地部署

1. 拉取项目源码

```sh
git clone https://gitlab.com/th1nk-er/EasyChat-Web.git
```

2. 安装依赖并启动预览

```sh
pnpm install
pnpm dev
```

### Docker部署

1. 构建镜像

```sh
docker build . -t easychat-web:latest
```

2. 启动容器

```sh
# 默认配置启动，后端地址为 localhost:8080
docker run -p 3000:80 -d easychat-web:latest
# 指定后端地址
docker run -p 3000:80 -e BACKEND_HOST=localhost -e BACKEND_PORT=8080 -d easychat-web:latest
```

## License

[MIT](LICENSE)

Copyright (c) 2024 th1nker
