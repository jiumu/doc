# Docker 基本命令

本文档介绍 Docker 的基本命令，帮助你快速掌握 Docker 的日常操作。

## 命令格式

Docker 命令的一般格式为：

```bash
docker [选项] 命令 [参数]
```

例如：

```bash
docker run -d -p 80:80 nginx
```

## 帮助命令

获取 Docker 帮助信息：

```bash
# 显示 Docker 版本信息
docker --version
docker -v

# 显示 Docker 系统信息
docker info

# 获取命令帮助
docker help
docker command --help  # 例如：docker run --help
```

## 镜像命令

### 搜索镜像

```bash
# 搜索镜像
docker search [选项] 镜像名称

# 示例：搜索 MySQL 镜像
docker search mysql

# 按星级搜索（stars>=3000）
docker search --filter=stars=3000 mysql
```

### 拉取镜像

```bash
# 拉取镜像（默认拉取最新版本 latest）
docker pull 镜像名称[:标签]

# 示例：拉取 MySQL 5.7 版本
docker pull mysql:5.7

# 拉取特定仓库的镜像
docker pull registry.example.com/my-image:tag
```

### 列出镜像

```bash
# 列出本地所有镜像
docker images
docker image ls

# 列出所有镜像（包括中间层镜像）
docker images -a

# 只显示镜像ID
docker images -q

# 显示镜像摘要信息
docker images --digests

# 按特定格式显示
docker images --format "{{.ID}}: {{.Repository}}"
```

### 删除镜像

```bash
# 删除指定镜像
docker rmi 镜像ID或镜像名称[:标签]

# 示例：删除 MySQL 镜像
docker rmi mysql:5.7

# 强制删除
docker rmi -f 镜像ID

# 删除所有镜像
docker rmi $(docker images -q)
```

### 镜像标签

```bash
# 为镜像添加新标签
docker tag 源镜像[:标签] 新镜像名[:标签]

# 示例：为 nginx 添加新标签
docker tag nginx:latest mynginx:v1.0
```

### 保存和加载镜像

```bash
# 将镜像保存为 tar 文件
docker save -o 文件名.tar 镜像名

# 示例：保存 nginx 镜像
docker save -o nginx.tar nginx:latest

# 从 tar 文件加载镜像
docker load -i 文件名.tar

# 示例：加载 nginx 镜像
docker load -i nginx.tar
```

### 镜像历史

```bash
# 查看镜像构建历史
docker history 镜像名称[:标签]

# 示例：查看 nginx 镜像历史
docker history nginx
```

## 容器命令

### 创建并运行容器

```bash
# 创建并启动容器
docker run [选项] 镜像名 [命令] [参数]

# 常用选项：
# -d: 后台运行
# -p: 端口映射，格式为 主机端口:容器端口
# -v: 挂载数据卷，格式为 主机目录:容器目录
# --name: 指定容器名称
# -e: 设置环境变量
# --network: 指定网络
# --restart: 重启策略

# 示例：运行 Nginx 容器
docker run -d -p 80:80 --name my-nginx nginx

# 示例：运行 MySQL 容器
docker run -d -p 3306:3306 --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -v mysql-data:/var/lib/mysql \
  mysql:5.7
```

### 查看容器

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括已停止的）
docker ps -a

# 只显示容器ID
docker ps -q

# 显示最近创建的n个容器
docker ps -n 3

# 显示容器大小
docker ps -s

# 按特定格式显示
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

### 容器生命周期管理

```bash
# 启动容器
docker start 容器ID或容器名

# 停止容器
docker stop 容器ID或容器名

# 重启容器
docker restart 容器ID或容器名

# 强制停止容器
docker kill 容器ID或容器名

# 暂停容器
docker pause 容器ID或容器名

# 恢复暂停的容器
docker unpause 容器ID或容器名
```

### 删除容器

```bash
# 删除已停止的容器
docker rm 容器ID或容器名

# 强制删除运行中的容器
docker rm -f 容器ID或容器名

# 删除所有已停止的容器
docker container prune

# 删除所有容器（包括运行中的）
docker rm -f $(docker ps -aq)
```

### 进入容器

```bash
# 进入容器执行命令（创建新的终端）
docker exec -it 容器ID或容器名 命令

# 示例：进入容器的bash终端
docker exec -it my-nginx bash

# 示例：在容器中执行单个命令
docker exec my-nginx ls -la

# 附加到容器的主进程（不创建新的终端）
docker attach 容器ID或容器名
```

### 容器日志

```bash
# 查看容器日志
docker logs 容器ID或容器名

# 实时查看日志
docker logs -f 容器ID或容器名

# 显示时间戳
docker logs -t 容器ID或容器名

# 显示最近n行日志
docker logs --tail 10 容器ID或容器名

# 从某个时间点开始查看日志
docker logs --since "2023-01-01T00:00:00" 容器ID或容器名
```

### 容器文件操作

```bash
# 从容器复制文件到主机
docker cp 容器ID或容器名:容器内路径 主机路径

# 示例：从容器复制配置文件
docker cp my-nginx:/etc/nginx/nginx.conf ./nginx.conf

# 从主机复制文件到容器
docker cp 主机路径 容器ID或容器名:容器内路径

# 示例：将配置文件复制到容器
docker cp ./nginx.conf my-nginx:/etc/nginx/nginx.conf
```

### 容器资源使用情况

```bash
# 查看容器资源使用统计
docker stats

# 查看指定容器的资源使用
docker stats 容器ID或容器名

# 查看容器进程
docker top 容器ID或容器名
```

### 容器元数据

```bash
# 查看容器详细信息
docker inspect 容器ID或容器名

# 查询特定信息（使用Go模板）
docker inspect --format='{{.NetworkSettings.IPAddress}}' 容器ID或容器名
```

### 容器提交为镜像

```bash
# 将容器保存为新镜像
docker commit [选项] 容器ID或容器名 [仓库[:标签]]

# 示例：将修改后的容器保存为新镜像
docker commit -a "Author" -m "Commit message" my-nginx my-custom-nginx:v1
```

## 数据卷命令

### 创建和管理数据卷

```bash
# 创建数据卷
docker volume create 卷名

# 列出所有数据卷
docker volume ls

# 查看数据卷详细信息
docker volume inspect 卷名

# 删除数据卷
docker volume rm 卷名

# 删除所有未使用的数据卷
docker volume prune
```

## 网络命令

### 创建和管理网络

```bash
# 创建网络
docker network create [选项] 网络名

# 示例：创建桥接网络
docker network create --driver bridge my-network

# 列出所有网络
docker network ls

# 查看网络详细信息
docker network inspect 网络名

# 删除网络
docker network rm 网络名

# 删除所有未使用的网络
docker network prune

# 将容器连接到网络
docker network connect 网络名 容器ID或容器名

# 将容器从网络断开
docker network disconnect 网络名 容器ID或容器名
```

## 系统命令

### 系统清理

```bash
# 删除所有未使用的对象（容器、网络、镜像、数据卷）
docker system prune

# 包括未使用的数据卷
docker system prune --volumes

# 包括所有未使用的镜像（不仅是悬空镜像）
docker system prune -a
```

### 系统信息

```bash
# 显示 Docker 磁盘使用情况
docker system df

# 显示详细的磁盘使用情况
docker system df -v

# 显示 Docker 事件
docker events

# 实时监控 Docker 事件
docker events --since '1h' --until '0m'
```

## 实用命令组合

### 批量操作

```bash
# 停止所有运行中的容器
docker stop $(docker ps -q)

# 删除所有已停止的容器
docker rm $(docker ps -aq -f status=exited)

# 删除所有未使用的镜像
docker image prune -a

# 删除所有名称包含特定字符串的容器
docker rm $(docker ps -a | grep "pattern" | awk '{print $1}')
```

### 监控和调试

```bash
# 实时监控所有容器的资源使用情况
docker stats --all --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# 查看容器内进程
docker top 容器ID或容器名

# 查看容器日志并跟踪
docker logs -f --tail 100 容器ID或容器名
```

## 命令速查表

| 类别 | 命令 | 描述 |
|------|------|------|
| 帮助 | `docker --version` | 显示 Docker 版本 |
| 帮助 | `docker info` | 显示系统信息 |
| 镜像 | `docker pull` | 拉取镜像 |
| 镜像 | `docker images` | 列出镜像 |
| 镜像 | `docker rmi` | 删除镜像 |
| 容器 | `docker run` | 创建并启动容器 |
| 容器 | `docker ps` | 列出容器 |
| 容器 | `docker start/stop` | 启动/停止容器 |
| 容器 | `docker exec` | 在容器中执行命令 |
| 容器 | `docker rm` | 删除容器 |
| 数据卷 | `docker volume create` | 创建数据卷 |
| 数据卷 | `docker volume ls` | 列出数据卷 |
| 网络 | `docker network create` | 创建网络 |
| 网络 | `docker network ls` | 列出网络 |
| 系统 | `docker system prune` | 清理未使用的资源 |

## 最佳实践

1. **使用具体的标签**：避免使用 `latest` 标签，使用特定版本标签以确保一致性
2. **使用别名**：为常用命令创建别名，提高效率
3. **使用 `--rm` 选项**：对于临时容器，使用 `--rm` 选项在容器停止后自动删除
4. **使用 `-d` 选项**：对于长期运行的服务，使用 `-d` 选项在后台运行
5. **定期清理**：使用 `docker system prune` 定期清理未使用的资源
6. **使用 `docker-compose`**：对于多容器应用，使用 docker-compose 简化管理

## 下一步学习

掌握这些基本命令后，建议继续学习：

1. Dockerfile 的编写
2. Docker Compose 的使用
3. Docker 网络配置
4. Docker 数据管理
5. Docker 安全最佳实践

## 参考资源

- [Docker 命令行参考](https://docs.docker.com/engine/reference/commandline/cli/)
- [Docker 命令备忘单](https://docs.docker.com/get-started/docker_cheatsheet.pdf)