# Docker 网络配置

Docker 网络是容器通信的基础，本文将详细介绍 Docker 网络的概念、类型、配置方法和最佳实践。

## Docker 网络基础

### 什么是 Docker 网络？

Docker 网络提供了容器之间以及容器与外部世界通信的能力。Docker 使用网络驱动程序来提供不同类型的网络功能，满足各种应用场景的需求。

### Docker 网络架构

Docker 网络架构包括以下组件：

1. **网络驱动程序**：提供不同类型的网络功能
2. **网络命名空间**：提供网络隔离
3. **虚拟以太网设备**：连接容器和主机
4. **网桥**：连接不同的网络段
5. **iptables 规则**：管理网络流量

## Docker 网络类型

Docker 提供了多种内置网络驱动程序，每种都有特定的用例：

### 1. Bridge 网络（桥接网络）

- **默认网络类型**
- 在同一主机上的容器之间提供通信
- 每个容器获得一个内部 IP 地址
- 通过端口映射访问外部网络

```bash
# 创建桥接网络
docker network create --driver bridge my-bridge-network

# 使用桥接网络启动容器
docker run --network my-bridge-network nginx
```

### 2. Host 网络（主机网络）

- 容器共享主机的网络命名空间
- 直接使用主机的网络接口
- 没有网络隔离
- 性能最好，但安全性较低

```bash
# 使用主机网络启动容器
docker run --network host nginx
```

### 3. None 网络（空网络）

- 容器没有网络接口
- 完全隔离的网络环境
- 适用于不需要网络的应用或自定义网络设置

```bash
# 使用空网络启动容器
docker run --network none nginx
```

### 4. Overlay 网络（覆盖网络）

- 用于 Docker Swarm 服务
- 允许不同主机上的容器通信
- 使用 VXLAN 技术实现跨主机通信

```bash
# 创建覆盖网络（需要 Swarm 模式）
docker network create --driver overlay my-overlay-network
```

### 5. Macvlan 网络

- 为容器分配 MAC 地址
- 容器直接连接到物理网络
- 容器看起来像物理网络上的设备

```bash
# 创建 Macvlan 网络
docker network create --driver macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my-macvlan-network
```

### 6. IPvlan 网络

- 类似于 Macvlan，但共享 MAC 地址
- 容器获得唯一的 IP 地址
- 适用于 MAC 地址数量有限的环境

```bash
# 创建 IPvlan 网络
docker network create --driver ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 my-ipvlan-network
```

## 默认网络

当安装 Docker 时，它会自动创建三个网络：

```bash
docker network ls
```

1. **bridge**：默认的桥接网络
2. **host**：主机网络
3. **none**：空网络

### 默认桥接网络的特点

- 所有容器默认连接到此网络
- 容器可以通过 IP 地址相互通信
- 容器名称不会自动解析为 IP 地址
- 端口需要手动映射到主机

## 自定义网络

### 创建自定义网络

```bash
# 创建桥接网络
docker network create my-network

# 创建带有子网和网关的网络
docker network create --subnet=172.18.0.0/16 --gateway=172.18.0.1 my-network

# 创建带有 IP 范围的网络
docker network create --subnet=172.18.0.0/16 --ip-range=172.18.5.0/24 my-network

# 指定驱动程序
docker network create --driver bridge my-network
```

### 自定义网络的优势

1. **自动 DNS 解析**：容器可以通过名称相互访问
2. **更好的隔离性**：容器可以连接到多个网络
3. **动态连接和断开**：容器可以在运行时连接或断开网络
4. **更细粒度的控制**：可以配置子网、IP 范围等

## 网络管理命令

### 列出网络

```bash
# 列出所有网络
docker network ls

# 过滤网络
docker network ls --filter driver=bridge

# 自定义输出格式
docker network ls --format "{{.ID}}: {{.Name}}"
```

### 检查网络

```bash
# 查看网络详细信息
docker network inspect my-network

# 查询特定信息
docker network inspect --format='{{.IPAM.Config}}' my-network
```

### 删除网络

```bash
# 删除网络
docker network rm my-network

# 删除所有未使用的网络
docker network prune
```

### 连接和断开容器

```bash
# 将运行中的容器连接到网络
docker network connect my-network container-name

# 指定 IP 地址连接
docker network connect --ip 172.18.5.10 my-network container-name

# 断开容器与网络的连接
docker network disconnect my-network container-name
```

## 容器间通信

### 同一网络中的容器通信

在自定义网络中，容器可以通过名称相互访问：

```bash
# 创建网络
docker network create app-network

# 启动容器并连接到网络
docker run -d --name web --network app-network nginx
docker run -d --name db --network app-network postgres

# 容器间通信（从 web 容器访问 db 容器）
docker exec -it web ping db
```

### 不同网络中的容器通信

容器可以连接到多个网络，实现跨网络通信：

```bash
# 创建两个网络
docker network create frontend
docker network create backend

# 启动容器并连接到不同网络
docker run -d --name web --network frontend nginx
docker run -d --name app --network backend python-app
docker run -d --name db --network backend postgres

# 将 app 容器连接到 frontend 网络
docker network connect frontend app

# 现在 app 可以与 web 和 db 通信
```

## 端口映射

### 发布容器端口

```bash
# 映射特定端口
docker run -p 8080:80 nginx

# 映射到特定 IP 地址
docker run -p 127.0.0.1:8080:80 nginx

# 映射到随机端口
docker run -p 80 nginx

# 映射 UDP 端口
docker run -p 53:53/udp dns-server

# 映射多个端口
docker run -p 80:80 -p 443:443 nginx
```

### 查看端口映射

```bash
# 查看容器的端口映射
docker port container-name
```

## 网络配置案例

### Web 应用 + 数据库

```bash
# 创建网络
docker network create webapp-network

# 启动数据库容器
docker run -d \
  --name db \
  --network webapp-network \
  -e MYSQL_ROOT_PASSWORD=secret \
  -e MYSQL_DATABASE=app \
  mysql:5.7

# 启动 Web 应用容器
docker run -d \
  --name web \
  --network webapp-network \
  -p 8080:80 \
  -e DB_HOST=db \
  -e DB_PASSWORD=secret \
  webapp:latest
```

### 使用 Docker Compose 配置网络

```yaml
# docker-compose.yml
version: '3'

services:
  web:
    image: nginx
    ports:
      - "8080:80"
    networks:
      - frontend
      - backend

  app:
    image: my-app
    networks:
      - backend

  db:
    image: postgres
    networks:
      - backend

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # 内部网络，不能访问外部
```

## 网络驱动程序高级配置

### Bridge 网络高级选项

```bash
docker network create \
  --driver bridge \
  --subnet=172.28.0.0/16 \
  --ip-range=172.28.5.0/24 \
  --gateway=172.28.0.1 \
  --opt com.docker.network.bridge.name=docker-br0 \
  --opt com.docker.network.bridge.enable_icc=true \
  --opt com.docker.network.bridge.enable_ip_masquerade=true \
  br0
```

### Macvlan 高级配置

```bash
# 创建 Macvlan 网络
docker network create \
  --driver macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  -o macvlan_mode=bridge \
  macvlan-net
```

### IPvlan 高级配置

```bash
# 创建 IPvlan 网络（L2 模式）
docker network create \
  --driver ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  -o ipvlan_mode=l2 \
  ipvlan-net-l2

# 创建 IPvlan 网络（L3 模式）
docker network create \
  --driver ipvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 \
  -o ipvlan_mode=l3 \
  ipvlan-net-l3
```

## 网络命名空间和 Linux 网络基础

### 理解网络命名空间

Docker 使用 Linux 网络命名空间来隔离容器网络：

```bash
# 查看容器的网络命名空间
PID=$(docker inspect --format='{{.State.Pid}}' container-name)
sudo nsenter -t $PID -n ip addr
```

### 虚拟以太网设备（veth）

每个连接到桥接网络的容器都有一对 veth 设备：

```bash
# 查看主机上的 veth 设备
ip link | grep veth
```

### 网桥

Docker 桥接网络使用 Linux 网桥：

```bash
# 查看 Docker 创建的网桥
ip link | grep docker
brctl show
```

## 网络故障排查

### 常见问题和解决方案

1. **容器无法连接到互联网**
   - 检查 DNS 配置
   - 验证 iptables 规则
   - 确认 IP 转发已启用

2. **容器间无法通信**
   - 确保容器在同一网络中
   - 检查网络驱动程序配置
   - 验证容器网络设置

3. **端口映射不工作**
   - 检查端口冲突
   - 验证应用程序是否监听正确的地址
   - 检查防火墙规则

### 故障排查命令

```bash
# 检查容器网络配置
docker inspect --format='{{json .NetworkSettings.Networks}}' container-name

# 进入容器检查网络
docker exec -it container-name sh -c "ip addr && ip route && cat /etc/resolv.conf"

# 测试容器间连接
docker exec -it container-name ping other-container

# 测试 DNS 解析
docker exec -it container-name nslookup google.com

# 检查端口映射
docker port container-name

# 检查主机网络规则
sudo iptables -t nat -L -n
```

## Docker DNS 服务

### 内置 DNS 服务器

Docker 提供内置 DNS 服务器，允许容器通过名称相互发现：

- 默认桥接网络：不提供 DNS 解析
- 自定义网络：提供容器名称到 IP 地址的 DNS 解析
- 容器的 `/etc/resolv.conf` 配置为使用 Docker DNS 服务器

### 自定义 DNS 配置

```bash
# 启动容器时指定 DNS 服务器
docker run --dns 8.8.8.8 nginx

# 指定 DNS 搜索域
docker run --dns-search example.com nginx

# 添加 /etc/hosts 条目
docker run --add-host db:192.168.1.10 nginx
```

### 全局 DNS 配置

在 Docker 守护程序配置中设置默认 DNS：

```json
// /etc/docker/daemon.json
{
  "dns": ["8.8.8.8", "8.8.4.4"],
  "dns-search": ["example.com"]
}
```

## 网络安全最佳实践

1. **使用内部网络**
   ```bash
   docker network create --internal private-network
   ```

2. **限制容器间通信**
   ```bash
   # 在 daemon.json 中设置
   {
     "icc": false
   }
   ```

3. **使用用户定义的网络而不是默认桥接网络**
   - 更好的隔离性
   - 自动 DNS 解析
   - 更细粒度的控制

4. **限制端口暴露**
   - 只映射必要的端口
   - 绑定到特定 IP 地址
   - 使用防火墙规则

5. **使用 TLS 加密容器通信**
   - 在应用层实现加密
   - 使用 HTTPS、TLS 或 SSH

## 高级网络场景

### 负载均衡

使用 Docker 网络和负载均衡器：

```bash
# 创建网络
docker network create lb-network

# 启动多个服务实例
docker run -d --name web1 --network lb-network nginx
docker run -d --name web2 --network lb-network nginx

# 启动负载均衡器
docker run -d \
  --name lb \
  --network lb-network \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

### 多主机网络

使用 Docker Swarm 实现多主机网络：

```bash
# 初始化 Swarm
docker swarm init

# 创建覆盖网络
docker network create --driver overlay my-overlay-network

# 创建服务
docker service create \
  --name my-service \
  --network my-overlay-network \
  --replicas 3 \
  nginx
```

### 网络隔离

创建隔离的网络环境：

```bash
# 创建前端网络
docker network create frontend

# 创建后端网络（内部网络）
docker network create --internal backend

# 部署应用
docker run -d --name web --network frontend -p 80:80 nginx
docker run -d --name app --network frontend --network backend app-image
docker run -d --name db --network backend db-image

# db 只能被 app 访问，不能访问外部网络
# app 可以访问 web 和 db
# web 可以访问外部网络和 app，但不能访问 db
```

## 总结

Docker 网络提供了灵活而强大的容器通信机制，从简单的单主机桥接网络到复杂的多主机覆盖网络。通过本文的学习，你应该能够：

1. 理解 Docker 网络的基本概念和类型
2. 创建和管理自定义网络
3. 配置容器间通信
4. 设置端口映射
5. 排查网络问题
6. 实施网络安全最佳实践

在下一章中，我们将探讨 Docker 数据卷，这是实现容器数据持久化的关键技术。