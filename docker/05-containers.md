# Docker 容器管理

Docker 容器是 Docker 的核心组件，本文将详细介绍 Docker 容器的生命周期、管理方法和最佳实践。

## 容器基础概念

### 什么是 Docker 容器？

Docker 容器是镜像的运行实例，是一个轻量级、可执行的独立软件包，包含运行应用程序所需的一切：代码、运行时环境、系统工具、系统库和设置。

### 容器与虚拟机的区别

| 特性 | 容器 | 虚拟机 |
|------|------|-------|
| 启动时间 | 秒级 | 分钟级 |
| 资源占用 | 轻量级 | 重量级 |
| 隔离级别 | 进程级隔离 | 硬件级隔离 |
| 操作系统 | 共享宿主机内核 | 独立操作系统 |
| 性能 | 接近原生 | 有一定损耗 |
| 镜像大小 | MB 级 | GB 级 |

### 容器的生命周期

Docker 容器的生命周期包括以下状态：

1. **创建（Created）**：容器已创建但未启动
2. **运行（Running）**：容器正在运行
3. **暂停（Paused）**：容器暂停运行
4. **停止（Stopped）**：容器已停止运行
5. **删除（Removed）**：容器被删除

![容器生命周期](https://docs.docker.com/engine/images/architecture.svg)

## 创建和运行容器

### 基本的容器运行命令

```bash
# 基本语法
docker run [选项] 镜像名 [命令] [参数]

# 示例：运行 nginx 容器
docker run -d -p 80:80 --name my-nginx nginx
```

### 常用的 run 命令选项

| 选项 | 描述 | 示例 |
|------|------|------|
| `-d, --detach` | 后台运行容器 | `docker run -d nginx` |
| `-p, --publish` | 端口映射 | `docker run -p 8080:80 nginx` |
| `-v, --volume` | 挂载数据卷 | `docker run -v /host/path:/container/path nginx` |
| `--name` | 指定容器名称 | `docker run --name my-nginx nginx` |
| `-e, --env` | 设置环境变量 | `docker run -e VAR=value nginx` |
| `--network` | 指定网络 | `docker run --network my-net nginx` |
| `--restart` | 重启策略 | `docker run --restart always nginx` |
| `-it` | 交互式终端 | `docker run -it ubuntu bash` |
| `--rm` | 容器停止后自动删除 | `docker run --rm nginx` |
| `--memory` | 内存限制 | `docker run --memory 512m nginx` |
| `--cpus` | CPU 限制 | `docker run --cpus 0.5 nginx` |

### 创建容器但不启动

```bash
docker create [选项] 镜像名 [命令] [参数]
```

### 运行交互式容器

```bash
# 运行并进入交互式容器
docker run -it ubuntu bash

# 退出容器但保持容器运行
# 按 Ctrl+P 然后 Ctrl+Q

# 退出并停止容器
# 输入 exit 或按 Ctrl+D
```

### 容器启动策略

```bash
# 容器退出时自动重启
docker run --restart=always nginx

# 容器非正常退出时重启
docker run --restart=on-failure nginx

# 容器非正常退出时重启，最多重启5次
docker run --restart=on-failure:5 nginx

# 除非手动停止，否则一直重启
docker run --restart=unless-stopped nginx
```

## 管理容器生命周期

### 启动、停止和重启容器

```bash
# 启动容器
docker start 容器ID或容器名

# 停止容器
docker stop 容器ID或容器名

# 强制停止容器
docker kill 容器ID或容器名

# 重启容器
docker restart 容器ID或容器名
```

### 暂停和恢复容器

```bash
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

## 查看容器信息

### 列出容器

```bash
# 列出运行中的容器
docker ps

# 列出所有容器（包括已停止的）
docker ps -a

# 只显示容器ID
docker ps -q

# 显示最近创建的n个容器
docker ps -n 3

# 显示容器大小
docker ps -s

# 自定义输出格式
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}"
```

### 查看容器详细信息

```bash
# 查看容器详细信息
docker inspect 容器ID或容器名

# 查询特定信息
docker inspect --format='{{.NetworkSettings.IPAddress}}' 容器ID或容器名

# 查看容器环境变量
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' 容器ID或容器名
```

### 查看容器日志

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

# 显示到某个时间点为止的日志
docker logs --until "2023-01-02T00:00:00" 容器ID或容器名
```

### 查看容器进程

```bash
# 查看容器中运行的进程
docker top 容器ID或容器名
```

### 查看容器资源使用情况

```bash
# 查看所有容器的资源使用统计
docker stats

# 查看特定容器的资源使用
docker stats 容器ID或容器名

# 自定义输出格式
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# 不刷新显示（只显示一次）
docker stats --no-stream
```

### 查看容器变更

```bash
# 查看容器文件系统的变更
docker diff 容器ID或容器名
```

## 容器交互和操作

### 进入运行中的容器

```bash
# 创建新的终端会话并连接到容器
docker exec -it 容器ID或容器名 bash

# 如果容器中没有bash，可以使用sh
docker exec -it 容器ID或容器名 sh

# 以特定用户身份执行命令
docker exec -it -u root 容器ID或容器名 bash
```

### 在容器中执行命令

```bash
# 在容器中执行单个命令
docker exec 容器ID或容器名 命令

# 示例：在容器中列出文件
docker exec my-nginx ls -la

# 示例：在容器中检查网络
docker exec my-nginx ping -c 3 google.com
```

### 附加到容器的主进程

```bash
# 附加到容器的主进程（不创建新的终端）
docker attach 容器ID或容器名
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

### 容器重命名

```bash
# 重命名容器
docker rename 旧名称 新名称

# 示例
docker rename my-old-container my-new-container
```

## 容器资源管理

### 设置资源限制

```bash
# 限制内存使用
docker run --memory 512m nginx

# 限制CPU使用
docker run --cpus 0.5 nginx

# 限制CPU核心
docker run --cpuset-cpus 0,1 nginx

# 限制内存和交换空间
docker run --memory 512m --memory-swap 1g nginx
```

### 更新运行中容器的资源限制

```bash
# 更新内存限制
docker update --memory 1g 容器ID或容器名

# 更新CPU限制
docker update --cpus 1 容器ID或容器名

# 更新重启策略
docker update --restart always 容器ID或容器名
```

## 容器网络管理

### 容器网络模式

Docker 提供了多种网络模式：

1. **bridge**：默认网络模式，容器通过桥接网络连接
2. **host**：容器使用宿主机网络
3. **none**：容器没有网络连接
4. **container**：容器共享另一个容器的网络命名空间
5. **自定义网络**：用户创建的网络

```bash
# 使用桥接网络
docker run --network bridge nginx

# 使用主机网络
docker run --network host nginx

# 不使用网络
docker run --network none nginx

# 共享另一个容器的网络
docker run --network container:another-container nginx

# 使用自定义网络
docker run --network my-custom-network nginx
```

### 端口映射

```bash
# 映射特定端口
docker run -p 8080:80 nginx

# 映射多个端口
docker run -p 8080:80 -p 443:443 nginx

# 映射到特定IP地址
docker run -p 127.0.0.1:8080:80 nginx

# 映射到随机端口
docker run -p 80 nginx
```

### 查看端口映射

```bash
# 查看容器的端口映射
docker port 容器ID或容器名
```

## 容器数据管理

### 数据卷挂载

```bash
# 挂载命名卷
docker run -v my-volume:/app/data nginx

# 挂载主机目录
docker run -v /host/path:/container/path nginx

# 挂载主机文件
docker run -v /host/file.conf:/container/file.conf nginx

# 只读挂载
docker run -v /host/path:/container/path:ro nginx
```

### 使用 bind mounts

```bash
# 使用 --mount 标志（更明确的语法）
docker run --mount type=bind,source=/host/path,target=/container/path nginx

# 只读挂载
docker run --mount type=bind,source=/host/path,target=/container/path,readonly nginx
```

### 使用临时文件系统

```bash
# 使用临时文件系统（tmpfs）
docker run --tmpfs /app/temp nginx

# 指定tmpfs选项
docker run --tmpfs /app/temp:rw,noexec,nosuid,size=100m nginx
```

## 容器环境配置

### 设置环境变量

```bash
# 设置单个环境变量
docker run -e VAR=value nginx

# 设置多个环境变量
docker run -e VAR1=value1 -e VAR2=value2 nginx

# 从文件加载环境变量
docker run --env-file ./env.list nginx
```

### 工作目录设置

```bash
# 设置容器内的工作目录
docker run -w /app nginx
```

### 用户设置

```bash
# 以特定用户运行容器
docker run -u 1000 nginx

# 以特定用户名运行容器
docker run -u nginx nginx
```

## 容器健康检查

### 配置健康检查

```bash
# 使用HTTP请求进行健康检查
docker run --health-cmd "curl -f http://localhost/ || exit 1" \
           --health-interval=5s \
           --health-retries=3 \
           --health-timeout=2s \
           --health-start-period=15s \
           nginx

# 使用命令进行健康检查
docker run --health-cmd "mysqladmin ping -h localhost" mysql
```

### 查看健康状态

```bash
# 查看容器健康状态
docker inspect --format='{{.State.Health.Status}}' 容器ID或容器名
```

## 容器日志管理

### 配置日志驱动

```bash
# 使用json-file日志驱动并限制大小
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 nginx

# 使用syslog日志驱动
docker run --log-driver syslog nginx

# 禁用日志
docker run --log-driver none nginx
```

### 查看日志驱动配置

```bash
docker inspect --format='{{.HostConfig.LogConfig}}' 容器ID或容器名
```

## 容器监控和调试

### 实时监控容器

```bash
# 监控所有容器的资源使用情况
docker stats

# 监控特定容器
docker stats 容器ID或容器名

# 自定义输出格式
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

### 调试容器问题

```bash
# 检查容器日志
docker logs 容器ID或容器名

# 检查容器进程
docker top 容器ID或容器名

# 检查容器详细信息
docker inspect 容器ID或容器名

# 进入容器进行调试
docker exec -it 容器ID或容器名 bash
```

### 容器事件监控

```bash
# 查看Docker事件
docker events

# 过滤特定容器的事件
docker events --filter container=容器ID或容器名

# 过滤特定事件类型
docker events --filter event=start --filter event=stop
```

## 容器安全

### 以非特权模式运行

```bash
# 以非特权模式运行容器
docker run --security-opt=no-new-privileges nginx
```

### 限制容器功能

```bash
# 删除所有功能并只添加需要的功能
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

### 只读文件系统

```bash
# 使用只读文件系统
docker run --read-only nginx
```

### 使用安全计算（seccomp）配置文件

```bash
# 应用seccomp配置文件
docker run --security-opt seccomp=/path/to/seccomp.json nginx
```

## 容器编排和管理

虽然本章主要关注单个容器的管理，但在实际生产环境中，通常需要使用容器编排工具来管理多个容器：

1. **Docker Compose**：适用于开发环境和简单的多容器应用
2. **Docker Swarm**：Docker原生的集群管理和编排工具
3. **Kubernetes**：最流行的容器编排平台，适用于大规模部署

这些工具将在后续章节中详细介绍。

## 容器管理最佳实践

1. **使用描述性容器名称**：便于识别和管理
2. **一个容器一个应用**：遵循"一个容器一个关注点"的原则
3. **使用健康检查**：确保应用程序正常运行
4. **合理设置资源限制**：防止单个容器消耗过多资源
5. **使用数据卷**：确保数据持久化和备份
6. **使用非特权用户**：减少安全风险
7. **定期更新基础镜像**：获取安全补丁
8. **使用 `--restart` 策略**：确保关键服务自动重启
9. **监控容器状态**：使用监控工具及时发现问题
10. **使用标签**：组织和管理容器

## 常见问题与解决方案

### 容器无法启动

可能原因和解决方案：
- 端口冲突：更改端口映射
- 资源不足：检查宿主机资源
- 配置错误：检查容器配置和环境变量
- 镜像问题：尝试使用不同版本的镜像

### 容器频繁重启

可能原因和解决方案：
- 应用崩溃：检查应用日志
- 资源限制过低：增加内存或CPU限制
- 健康检查失败：调整健康检查参数
- 依赖服务不可用：确保所有依赖服务正常运行

### 容器性能问题

可能原因和解决方案：
- 资源竞争：限制容器资源使用
- 磁盘I/O瓶颈：使用数据卷或调整存储驱动
- 网络瓶颈：检查网络配置和流量
- 应用程序问题：优化应用程序代码

## 总结

Docker 容器是 Docker 生态系统的核心组件，掌握容器的生命周期管理、资源配置、网络设置和数据管理等方面的知识，对于高效使用 Docker 至关重要。通过本文介绍的命令和最佳实践，你可以更好地创建、管理和监控 Docker 容器，提高应用程序的可靠性和性能。

在下一章中，我们将深入探讨 Docker Compose，这是一个用于定义和运行多容器 Docker 应用程序的工具。