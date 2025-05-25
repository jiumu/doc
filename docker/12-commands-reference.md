# Docker 命令参考

本文档提供了 Docker 常用命令的详细参考，包括命令参数、默认值和简短说明。这是一个快速查询指南，帮助你在日常工作中高效使用 Docker。

## 基本命令

### docker version
显示 Docker 客户端和服务器版本信息。

**语法**：
```bash
docker version [OPTIONS]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）
- `--kubeconfig`：Kubernetes 配置文件（默认值：无）

### docker info
显示系统范围的 Docker 信息。

**语法**：
```bash
docker info [OPTIONS]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）

### docker login
登录到 Docker 镜像仓库。

**语法**：
```bash
docker login [OPTIONS] [SERVER]
```

**选项**：
- `--password`, `-p`：密码（默认值：无）
- `--username`, `-u`：用户名（默认值：无）
- `--password-stdin`：从标准输入读取密码（默认值：false）

### docker logout
从 Docker 镜像仓库登出。

**语法**：
```bash
docker logout [SERVER]
```

## 镜像管理

### docker pull
从镜像仓库拉取镜像。

**语法**：
```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

**选项**：
- `--all-tags`, `-a`：下载仓库中的所有标签镜像（默认值：false）
- `--disable-content-trust`：跳过镜像验证（默认值：true）
- `--platform`：如果服务器支持多平台，则设置平台（默认值：无）
- `--quiet`, `-q`：禁止详细输出（默认值：false）

### docker push
将本地镜像推送到镜像仓库。

**语法**：
```bash
docker push [OPTIONS] NAME[:TAG]
```

**选项**：
- `--disable-content-trust`：跳过镜像签名（默认值：true）
- `--quiet`, `-q`：禁止详细输出（默认值：false）

### docker images
列出本地镜像。

**语法**：
```bash
docker images [OPTIONS] [REPOSITORY[:TAG]]
```

**选项**：
- `--all`, `-a`：显示所有镜像（默认隐藏中间镜像）（默认值：false）
- `--digests`：显示摘要（默认值：false）
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板打印镜像（默认值：无）
- `--no-trunc`：不截断输出（默认值：false）
- `--quiet`, `-q`：只显示镜像 ID（默认值：false）

### docker build
从 Dockerfile 构建镜像。

**语法**：
```bash
docker build [OPTIONS] PATH | URL | -
```

**选项**：
- `--build-arg`：设置构建时变量（默认值：无）
- `--cache-from`：将镜像视为缓存源（默认值：无）
- `--disable-content-trust`：跳过镜像验证（默认值：true）
- `--file`, `-f`：Dockerfile 的名称（默认值：PATH/Dockerfile）
- `--label`：设置镜像的元数据（默认值：无）
- `--no-cache`：构建镜像时不使用缓存（默认值：false）
- `--pull`：总是尝试拉取更新的镜像（默认值：false）
- `--quiet`, `-q`：禁止构建输出并打印镜像 ID（默认值：false）
- `--tag`, `-t`：镜像的名称和标签，格式为 'name:tag'（默认值：无）
- `--target`：设置构建的目标构建阶段（默认值：无）

### docker rmi
删除一个或多个镜像。

**语法**：
```bash
docker rmi [OPTIONS] IMAGE [IMAGE...]
```

**选项**：
- `--force`, `-f`：强制删除镜像（默认值：false）
- `--no-prune`：不删除未标记的父镜像（默认值：false）

### docker tag
为镜像创建一个新的标签。

**语法**：
```bash
docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
```

### docker save
将一个或多个镜像保存到 tar 归档文件。

**语法**：
```bash
docker save [OPTIONS] IMAGE [IMAGE...]
```

**选项**：
- `--output`, `-o`：写入到文件，而不是 STDOUT（默认值：无）

### docker load
从 tar 归档文件或 STDIN 加载镜像。

**语法**：
```bash
docker load [OPTIONS]
```

**选项**：
- `--input`, `-i`：从 tar 归档文件读取，而不是 STDIN（默认值：无）
- `--quiet`, `-q`：禁止加载输出（默认值：false）

### docker history
显示镜像的历史。

**语法**：
```bash
docker history [OPTIONS] IMAGE
```

**选项**：
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--human`, `-H`：以人类可读的格式打印大小和日期（默认值：true）
- `--no-trunc`：不截断输出（默认值：false）
- `--quiet`, `-q`：只显示 ID（默认值：false）

## 容器管理

### docker run
在新容器中运行命令。

**语法**：
```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**常用选项**：
- `--detach`, `-d`：在后台运行容器并打印容器 ID（默认值：false）
- `--env`, `-e`：设置环境变量（默认值：无）
- `--interactive`, `-i`：即使没有连接，也保持 STDIN 打开（默认值：false）
- `--name`：为容器指定名称（默认值：无）
- `--network`：将容器连接到网络（默认值："default"）
- `--publish`, `-p`：将容器的端口发布到主机（默认值：无）
- `--rm`：容器退出时自动删除（默认值：false）
- `--tty`, `-t`：分配一个伪 TTY（默认值：false）
- `--volume`, `-v`：绑定挂载卷（默认值：无）
- `--workdir`, `-w`：容器内的工作目录（默认值：无）

### docker ps
列出容器。

**语法**：
```bash
docker ps [OPTIONS]
```

**选项**：
- `--all`, `-a`：显示所有容器（默认只显示运行中的）（默认值：false）
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--last`, `-n`：显示最后创建的 n 个容器（默认值：-1）
- `--latest`, `-l`：显示最新创建的容器（默认值：false）
- `--no-trunc`：不截断输出（默认值：false）
- `--quiet`, `-q`：只显示容器 ID（默认值：false）
- `--size`, `-s`：显示总文件大小（默认值：false）

### docker start
启动一个或多个已停止的容器。

**语法**：
```bash
docker start [OPTIONS] CONTAINER [CONTAINER...]
```

**选项**：
- `--attach`, `-a`：连接 STDOUT/STDERR 并转发信号（默认值：false）
- `--interactive`, `-i`：连接容器的 STDIN（默认值：false）

### docker stop
停止一个或多个运行中的容器。

**语法**：
```bash
docker stop [OPTIONS] CONTAINER [CONTAINER...]
```

**选项**：
- `--time`, `-t`：等待停止的秒数（默认值：10）

### docker restart
重启一个或多个容器。

**语法**：
```bash
docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

**选项**：
- `--time`, `-t`：等待停止的秒数（默认值：10）

### docker kill
杀死一个或多个运行中的容器。

**语法**：
```bash
docker kill [OPTIONS] CONTAINER [CONTAINER...]
```

**选项**：
- `--signal`, `-s`：发送给容器的信号（默认值："KILL"）

### docker rm
删除一个或多个容器。

**语法**：
```bash
docker rm [OPTIONS] CONTAINER [CONTAINER...]
```

**选项**：
- `--force`, `-f`：强制删除正在运行的容器（使用 SIGKILL）（默认值：false）
- `--link`, `-l`：删除指定的链接（默认值：false）
- `--volumes`, `-v`：删除与容器关联的匿名卷（默认值：false）

### docker exec
在运行的容器中执行命令。

**语法**：
```bash
docker exec [OPTIONS] CONTAINER COMMAND [ARG...]
```

**选项**：
- `--detach`, `-d`：分离模式：在后台运行命令（默认值：false）
- `--env`, `-e`：设置环境变量（默认值：无）
- `--interactive`, `-i`：即使没有连接，也保持 STDIN 打开（默认值：false）
- `--privileged`：为命令提供扩展权限（默认值：false）
- `--tty`, `-t`：分配一个伪 TTY（默认值：false）
- `--user`, `-u`：用户名或 UID（格式：<name|uid>[:<group|gid>]）（默认值：无）
- `--workdir`, `-w`：容器内的工作目录（默认值：无）

### docker logs
获取容器的日志。

**语法**：
```bash
docker logs [OPTIONS] CONTAINER
```

**选项**：
- `--details`：显示额外的详细信息（默认值：false）
- `--follow`, `-f`：跟踪日志输出（默认值：false）
- `--since`：显示自时间戳以来的日志（例如 2013-01-02T13:23:37Z）或相对时间（例如 42m）（默认值：无）
- `--tail`：显示日志的行数（默认值："all"）
- `--timestamps`, `-t`：显示时间戳（默认值：false）
- `--until`：显示直到时间戳的日志（例如 2013-01-02T13:23:37Z）或相对时间（例如 42m）（默认值：无）

### docker cp
在容器和本地文件系统之间复制文件/文件夹。

**语法**：
```bash
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

**选项**：
- `--archive`, `-a`：归档模式（复制所有 uid/gid 信息）（默认值：无）
- `--follow-link`, `-L`：始终跟随 SRC_PATH 中的符号链接（默认值：无）

### docker stats
显示容器的实时资源使用统计信息。

**语法**：
```bash
docker stats [OPTIONS] [CONTAINER...]
```

**选项**：
- `--all`, `-a`：显示所有容器（默认只显示运行中的）（默认值：false）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--no-stream`：禁用流统计信息，只拉取第一个结果（默认值：false）
- `--no-trunc`：不截断输出（默认值：false）

### docker top
显示容器中运行的进程。

**语法**：
```bash
docker top CONTAINER [ps OPTIONS]
```

### docker inspect
返回有关 Docker 对象的低级信息。

**语法**：
```bash
docker inspect [OPTIONS] NAME|ID [NAME|ID...]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）
- `--size`, `-s`：如果类型是容器，则显示总文件大小（默认值：false）
- `--type`：返回指定类型的 JSON（默认值：无）

## 网络管理

### docker network create
创建一个网络。

**语法**：
```bash
docker network create [OPTIONS] NETWORK
```

**选项**：
- `--attachable`：启用手动容器连接（默认值：false）
- `--driver`, `-d`：网络的驱动程序（默认值："bridge"）
- `--gateway`：主子网的 IPv4 或 IPv6 网关（默认值：无）
- `--internal`：限制外部访问网络（默认值：false）
- `--ip-range`：从子范围分配容器 IP（默认值：无）
- `--ipam-driver`：IP 地址管理驱动程序（默认值："default"）
- `--ipam-opt`：设置 IPAM 驱动程序特定选项（默认值：无）
- `--ipv6`：启用 IPv6 网络（默认值：false）
- `--label`：设置网络的元数据（默认值：无）
- `--opt`, `-o`：设置驱动程序特定选项（默认值：无）
- `--subnet`：表示网段的 CIDR 格式的子网（默认值：无）

### docker network ls
列出网络。

**语法**：
```bash
docker network ls [OPTIONS]
```

**选项**：
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--no-trunc`：不截断输出（默认值：false）
- `--quiet`, `-q`：只显示网络 ID（默认值：false）

### docker network inspect
显示一个或多个网络的详细信息。

**语法**：
```bash
docker network inspect [OPTIONS] NETWORK [NETWORK...]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）
- `--verbose`, `-v`：详细输出以进行诊断（默认值：false）

### docker network connect
将容器连接到网络。

**语法**：
```bash
docker network connect [OPTIONS] NETWORK CONTAINER
```

**选项**：
- `--alias`：为容器添加网络范围的别名（默认值：无）
- `--driver-opt`：网络驱动程序选项（默认值：无）
- `--ip`：IPv4 地址（例如 172.30.100.104）（默认值：无）
- `--ip6`：IPv6 地址（例如 2001:db8::33）（默认值：无）
- `--link`：添加到另一个容器的链接（默认值：无）
- `--link-local-ip`：为容器添加链接本地地址（默认值：无）

### docker network disconnect
断开容器与网络的连接。

**语法**：
```bash
docker network disconnect [OPTIONS] NETWORK CONTAINER
```

**选项**：
- `--force`, `-f`：强制容器断开连接（默认值：false）

### docker network rm
删除一个或多个网络。

**语法**：
```bash
docker network rm NETWORK [NETWORK...]
```

### docker network prune
删除所有未使用的网络。

**语法**：
```bash
docker network prune [OPTIONS]
```

**选项**：
- `--filter`：根据提供的条件过滤（默认值：无）
- `--force`, `-f`：不提示确认（默认值：false）

## 数据卷管理

### docker volume create
创建一个卷。

**语法**：
```bash
docker volume create [OPTIONS] [VOLUME]
```

**选项**：
- `--driver`, `-d`：指定卷驱动程序名称（默认值："local"）
- `--label`：设置卷的元数据（默认值：无）
- `--name`：指定卷名称（默认值：无）
- `--opt`, `-o`：设置驱动程序特定选项（默认值：无）

### docker volume ls
列出卷。

**语法**：
```bash
docker volume ls [OPTIONS]
```

**选项**：
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--quiet`, `-q`：只显示卷名称（默认值：false）

### docker volume inspect
显示一个或多个卷的详细信息。

**语法**：
```bash
docker volume inspect [OPTIONS] VOLUME [VOLUME...]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）

### docker volume rm
删除一个或多个卷。

**语法**：
```bash
docker volume rm [OPTIONS] VOLUME [VOLUME...]
```

**选项**：
- `--force`, `-f`：强制删除一个或多个卷（默认值：false）

### docker volume prune
删除所有未使用的本地卷。

**语法**：
```bash
docker volume prune [OPTIONS]
```

**选项**：
- `--filter`：根据提供的条件过滤（默认值：无）
- `--force`, `-f`：不提示确认（默认值：false）

## Docker Compose

### docker-compose up
创建并启动容器。

**语法**：
```bash
docker-compose up [OPTIONS] [SERVICE...]
```

**选项**：
- `--build`：启动容器前构建镜像（默认值：false）
- `--detach`, `-d`：分离模式：在后台运行容器（默认值：false）
- `--force-recreate`：即使配置和镜像没有变化，也要重新创建容器（默认值：false）
- `--no-build`：不构建镜像，即使它不存在（默认值：false）
- `--no-color`：单色输出（默认值：false）
- `--no-deps`：不启动链接的服务（默认值：false）
- `--no-recreate`：如果容器已存在，则不重新创建它们（默认值：false）
- `--no-start`：创建服务但不启动（默认值：false）
- `--remove-orphans`：删除未在 Compose 文件中定义的容器（默认值：false）
- `--scale`：设置服务的容器数量（默认值：无）

### docker-compose down
停止并删除容器、网络、镜像和卷。

**语法**：
```bash
docker-compose down [OPTIONS]
```

**选项**：
- `--remove-orphans`：删除未在 Compose 文件中定义的容器（默认值：false）
- `--rmi`：删除镜像，类型：all（删除所有镜像）或 local（仅删除没有自定义标签的镜像）（默认值：无）
- `--volumes`, `-v`：删除在 docker-compose.yml 中声明的命名卷和匿名卷（默认值：false）

### docker-compose ps
列出容器。

**语法**：
```bash
docker-compose ps [OPTIONS] [SERVICE...]
```

**选项**：
- `--all`, `-a`：显示所有容器（默认只显示运行中的）（默认值：false）
- `--quiet`, `-q`：只显示 ID（默认值：false）
- `--services`：显示服务（默认值：false）

### docker-compose logs
查看服务的输出。

**语法**：
```bash
docker-compose logs [OPTIONS] [SERVICE...]
```

**选项**：
- `--follow`, `-f`：跟踪日志输出（默认值：false）
- `--no-color`：单色输出（默认值：false）
- `--tail`：每个容器显示的日志行数（默认值："all"）
- `--timestamps`, `-t`：显示时间戳（默认值：false）

### docker-compose build
构建或重建服务。

**语法**：
```bash
docker-compose build [OPTIONS] [SERVICE...]
```

**选项**：
- `--build-arg`：设置构建时变量（默认值：无）
- `--compress`：使用 gzip 压缩构建上下文（默认值：false）
- `--force-rm`：始终删除中间容器（默认值：false）
- `--no-cache`：构建镜像时不使用缓存（默认值：false）
- `--pull`：始终尝试拉取更新的镜像（默认值：false）

### docker-compose restart
重启服务。

**语法**：
```bash
docker-compose restart [OPTIONS] [SERVICE...]
```

**选项**：
- `--timeout`, `-t`：指定关闭超时（默认值：10）

### docker-compose start
启动服务。

**语法**：
```bash
docker-compose start [SERVICE...]
```

### docker-compose stop
停止服务。

**语法**：
```bash
docker-compose stop [OPTIONS] [SERVICE...]
```

**选项**：
- `--timeout`, `-t`：指定关闭超时（默认值：10）

### docker-compose exec
在运行的容器中执行命令。

**语法**：
```bash
docker-compose exec [OPTIONS] SERVICE COMMAND [ARGS...]
```

**选项**：
- `--detach`, `-d`：分离模式：在后台运行命令（默认值：false）
- `--index`：如果有多个实例，则指定容器索引（默认值：1）
- `--privileged`：为命令提供扩展权限（默认值：false）
- `--user`, `-u`：以指定用户身份运行命令（默认值：无）
- `--workdir`, `-w`：容器内的工作目录（默认值：无）

## Docker Swarm

### docker swarm init
初始化一个 swarm。

**语法**：
```bash
docker swarm init [OPTIONS]
```

**选项**：
- `--advertise-addr`：发布（对其他节点）的地址（默认值：无）
- `--autolock`：启用管理器自动锁定（需要解锁密钥才能重新启动管理器）（默认值：false）
- `--availability`：节点的可用性（"active"|"pause"|"drain"）（默认值："active"）
- `--cert-expiry`：节点证书的有效期（默认值：2160h0m0s）
- `--data-path-addr`：用于数据路径流量的地址（默认值：无）
- `--default-addr-pool`：默认地址池（默认值：无）
- `--default-addr-pool-mask-length`：默认地址池掩码长度（默认值：24）
- `--force-new-cluster`：强制创建一个新集群（默认值：false）
- `--listen-addr`：监听地址（默认值：0.0.0.0:2377）
- `--task-history-limit`：任务历史保留限制（默认值：5）

### docker swarm join
将节点加入 swarm。

**语法**：
```bash
docker swarm join [OPTIONS] HOST:PORT
```

**选项**：
- `--advertise-addr`：发布（对其他节点）的地址（默认值：无）
- `--availability`：节点的可用性（"active"|"pause"|"drain"）（默认值："active"）
- `--data-path-addr`：用于数据路径流量的地址（默认值：无）
- `--listen-addr`：监听地址（默认值：0.0.0.0:2377）
- `--token`：加入令牌（默认值：无）

### docker swarm leave
离开 swarm。

**语法**：
```bash
docker swarm leave [OPTIONS]
```

**选项**：
- `--force`, `-f`：强制离开，即使这个节点是最后一个管理器或有其他警告（默认值：false）

### docker service create
创建一个新服务。

**语法**：
```bash
docker service create [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**常用选项**：
- `--detach`, `-d`：退出而不等待服务收敛（默认值：false）
- `--env`, `-e`：设置环境变量（默认值：无）
- `--name`：服务名称（默认值：无）
- `--network`：网络连接（默认值：无）
- `--publish`, `-p`：将端口发布为节点端口（默认值：无）
- `--replicas`：任务数量（默认值：1）

### docker service ls
列出服务。

**语法**：
```bash
docker service ls [OPTIONS]
```

**选项**：
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--quiet`, `-q`：只显示 ID（默认值：false）

### docker service ps
列出一个或多个服务的任务。

**语法**：
```bash
docker service ps [OPTIONS] SERVICE [SERVICE...]
```

**选项**：
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--no-resolve`：不将 ID 映射到名称（默认值：false）
- `--no-trunc`：不截断输出（默认值：false）
- `--quiet`, `-q`：只显示任务 ID（默认值：false）

### docker service rm
删除一个或多个服务。

**语法**：
```bash
docker service rm SERVICE [SERVICE...]
```

### docker service update
更新服务。

**语法**：
```bash
docker service update [OPTIONS] SERVICE
```

**常用选项**：
- `--env-add`：添加或更新环境变量（默认值：无）
- `--env-rm`：删除环境变量（默认值：无）
- `--image`：服务容器镜像（默认值：无）
- `--publish-add`：添加或更新已发布的端口（默认值：无）
- `--publish-rm`：删除已发布的端口（默认值：无）
- `--replicas`：任务数量（默认值：无）

## 系统管理

### docker system df
显示 Docker 磁盘使用情况。

**语法**：
```bash
docker system df [OPTIONS]
```

**选项**：
- `--format`：使用 Go 模板格式化输出（默认值：无）
- `--verbose`, `-v`：显示详细信息（默认值：false）

### docker system info
显示系统范围的信息。

**语法**：
```bash
docker system info [OPTIONS]
```

**选项**：
- `--format`, `-f`：使用指定的 Go 模板格式化输出（默认值：无）

### docker system prune
删除未使用的数据。

**语法**：
```bash
docker system prune [OPTIONS]
```

**选项**：
- `--all`, `-a`：删除所有未使用的镜像，不仅仅是悬空镜像（默认值：false）
- `--filter`：根据提供的条件过滤（默认值：无）
- `--force`, `-f`：不提示确认（默认值：false）
- `--volumes`：删除未使用的卷（默认值：false）

### docker system events
获取实时系统事件。

**语法**：
```bash
docker system events [OPTIONS]
```

**选项**：
- `--filter`, `-f`：根据提供的条件过滤输出（默认值：无）
- `--format`：使用指定的格式化输出（默认值：无）
- `--since`：显示自时间戳以来的事件（默认值：无）
- `--until`：显示直到时间戳的事件（默认值：无）