# Docker 镜像管理

Docker 镜像是 Docker 容器的基础，本文将详细介绍 Docker 镜像的概念、管理方法和最佳实践。

## 镜像基础概念

### 什么是 Docker 镜像？

Docker 镜像是一个只读的模板，用于创建 Docker 容器。镜像包含了运行应用程序所需的所有内容：代码、运行时环境、库、环境变量和配置文件等。

### 镜像的特点

1. **分层结构**：镜像由多个层（layers）组成，每层代表 Dockerfile 中的一条指令
2. **只读**：镜像创建后不可修改，任何修改都会创建新的层
3. **共享**：不同镜像可以共享相同的底层，节省存储空间
4. **可移植**：可以在任何支持 Docker 的平台上运行

### 镜像与容器的关系

- 镜像是静态的定义，类似于类（Class）
- 容器是镜像的运行实例，类似于对象（Object）
- 一个镜像可以创建多个容器
- 容器运行时可以修改，但不会影响原始镜像

## 镜像的命名与标签

### 镜像命名规则

Docker 镜像的完整名称格式为：

```
[registry-host[:port]/][username/]repository[:tag]
```

例如：
- `nginx:latest`
- `ubuntu:20.04`
- `docker.io/library/alpine:3.14`
- `registry.example.com:5000/myapp:v1.0`

### 标签（Tags）

- 标签用于区分同一仓库中的不同镜像版本
- 如果不指定标签，默认使用 `latest`
- 常见的标签命名策略：
  - 版本号：`v1.0`, `2.1.3`
  - 日期：`20230101`
  - 环境：`dev`, `prod`
  - 操作系统/架构：`alpine`, `slim`, `arm64v8`

## 获取镜像

### 从公共仓库拉取镜像

```bash
# 基本语法
docker pull [选项] 镜像名[:标签]

# 示例：拉取最新版 nginx
docker pull nginx

# 示例：拉取特定版本的 nginx
docker pull nginx:1.21

# 示例：从特定仓库拉取镜像
docker pull docker.io/library/nginx:1.21
```

### 拉取镜像的选项

```bash
# 拉取所有标签
docker pull --all-tags nginx

# 指定平台（适用于多架构镜像）
docker pull --platform linux/arm64 nginx
```

### 从私有仓库拉取镜像

```bash
# 登录私有仓库
docker login registry.example.com

# 拉取私有仓库镜像
docker pull registry.example.com/myapp:v1.0
```

## 查看和管理本地镜像

### 列出本地镜像

```bash
# 列出所有镜像
docker images
docker image ls

# 列出特定仓库的镜像
docker images nginx

# 列出特定标签的镜像
docker images nginx:1.21

# 只显示镜像ID
docker images -q

# 显示镜像摘要
docker images --digests

# 显示未被任何标签引用的镜像（悬空镜像）
docker images --filter "dangling=true"

# 自定义输出格式
docker images --format "{{.ID}}: {{.Repository}}:{{.Tag}}"
```

### 查看镜像详细信息

```bash
# 查看镜像详细信息
docker inspect 镜像ID或镜像名称[:标签]

# 查询特定信息
docker inspect --format='{{.RepoTags}}' nginx
```

### 查看镜像历史

```bash
# 查看镜像构建历史
docker history nginx

# 不截断输出
docker history --no-trunc nginx
```

### 镜像标签管理

```bash
# 为镜像添加新标签
docker tag 源镜像[:标签] 目标镜像[:标签]

# 示例：为 nginx 添加自定义标签
docker tag nginx:latest myapp/nginx:v1.0
```

### 删除镜像

```bash
# 删除指定镜像
docker rmi 镜像ID或镜像名称[:标签]

# 强制删除（即使有容器使用该镜像）
docker rmi -f nginx:latest

# 删除所有未使用的镜像
docker image prune

# 删除所有未被容器使用的镜像
docker image prune -a

# 删除所有镜像
docker rmi $(docker images -q)
```

## 创建镜像

### 基于 Dockerfile 创建镜像

```bash
# 基本语法
docker build [选项] 路径

# 示例：从当前目录的 Dockerfile 构建
docker build -t myapp:v1.0 .

# 指定 Dockerfile 路径
docker build -t myapp:v1.0 -f /path/to/Dockerfile .

# 添加构建参数
docker build -t myapp:v1.0 --build-arg VERSION=1.0 .

# 不使用缓存构建
docker build --no-cache -t myapp:v1.0 .
```

### 基于容器创建镜像

```bash
# 将容器保存为新镜像
docker commit [选项] 容器ID或容器名 [仓库[:标签]]

# 示例：将修改后的容器保存为新镜像
docker commit -a "Author" -m "Commit message" my-container myapp:v1.0
```

### 导入和导出镜像

```bash
# 将镜像保存为 tar 文件
docker save -o nginx.tar nginx:latest

# 从 tar 文件加载镜像
docker load -i nginx.tar

# 从 URL 或标准输入导入镜像
docker import url/file.tar repository[:tag]
```

## 镜像仓库操作

### 推送镜像到仓库

```bash
# 登录到 Docker Hub
docker login

# 推送镜像到 Docker Hub
docker push username/repository[:tag]

# 登录到私有仓库
docker login registry.example.com

# 推送镜像到私有仓库
docker push registry.example.com/myapp:v1.0
```

### 搜索镜像

```bash
# 搜索 Docker Hub 上的镜像
docker search nginx

# 按星级过滤
docker search --filter=stars=100 nginx

# 只显示官方镜像
docker search --filter=is-official=true nginx

# 限制结果数量
docker search --limit=5 nginx
```

## 多架构镜像

### 什么是多架构镜像？

多架构镜像允许同一个镜像名称支持不同的操作系统和CPU架构，Docker会自动选择与当前系统匹配的版本。

### 创建多架构镜像

```bash
# 创建并使用构建器实例
docker buildx create --name mybuilder --use

# 构建并推送多架构镜像
docker buildx build --platform linux/amd64,linux/arm64 -t username/myapp:latest --push .
```

### 检查镜像支持的架构

```bash
docker manifest inspect nginx | grep architecture
```

## 镜像优化

### 减小镜像大小的策略

1. **使用轻量级基础镜像**：
   - Alpine Linux (`alpine`)
   - Debian Slim (`slim`)
   - Distroless images

2. **多阶段构建**：
   ```dockerfile
   # 构建阶段
   FROM golang:1.17 AS builder
   WORKDIR /app
   COPY . .
   RUN go build -o myapp
   
   # 运行阶段
   FROM alpine:3.14
   COPY --from=builder /app/myapp /usr/local/bin/
   CMD ["myapp"]
   ```

3. **优化 Dockerfile**：
   - 合并 RUN 指令
   - 清理不必要的文件
   - 使用 .dockerignore 文件

4. **使用特定版本标签**：避免使用 `latest` 标签

### 镜像分层优化

1. 将不经常变化的层放在前面
2. 将经常变化的层放在后面
3. 合理使用缓存

## 镜像安全

### 镜像漏洞扫描

```bash
# 使用 Docker Scan（需要 Docker Desktop）
docker scan nginx:latest

# 使用第三方工具如 Trivy
trivy image nginx:latest
```

### 镜像签名和验证

```bash
# 使用 Docker Content Trust 签名镜像
export DOCKER_CONTENT_TRUST=1
docker push username/myapp:latest

# 验证签名
docker trust inspect username/myapp:latest
```

## 镜像管理最佳实践

1. **使用特定版本标签**：避免使用 `latest` 标签，使用明确的版本标签确保一致性
2. **定期更新基础镜像**：获取安全补丁和性能改进
3. **使用多阶段构建**：减小最终镜像大小
4. **实施镜像扫描**：定期扫描镜像中的安全漏洞
5. **使用 .dockerignore 文件**：排除不必要的文件
6. **优化构建缓存**：合理安排 Dockerfile 指令顺序
7. **使用镜像标签策略**：制定一致的标签命名策略
8. **定期清理未使用的镜像**：使用 `docker image prune` 释放磁盘空间
9. **考虑使用镜像仓库**：使用私有仓库管理内部镜像
10. **文档化镜像用途**：在 Dockerfile 中添加注释和说明

## 常见问题与解决方案

### 镜像拉取失败

可能原因和解决方案：
- 网络问题：检查网络连接
- 权限问题：确保已登录到相应的仓库
- 镜像不存在：检查镜像名称和标签是否正确
- 配置镜像加速器：使用国内镜像源加速下载

### 镜像构建失败

可能原因和解决方案：
- Dockerfile 语法错误：检查 Dockerfile 语法
- 构建上下文问题：确保所需文件在构建上下文中
- 依赖问题：确保所有依赖可访问
- 使用 `--no-cache` 选项重新构建

### 磁盘空间不足

解决方案：
- 删除未使用的镜像：`docker image prune -a`
- 删除未使用的数据卷：`docker volume prune`
- 删除构建缓存：`docker builder prune`

## 总结

Docker 镜像是容器化应用的基础，掌握镜像的管理对于高效使用 Docker 至关重要。通过本文介绍的命令和最佳实践，你可以更好地创建、管理和优化 Docker 镜像，提高开发和部署效率。

在下一章中，我们将深入探讨 Docker 容器的管理，包括容器的创建、运行、监控和维护等方面。