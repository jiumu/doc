# Docker Swarm

Docker Swarm 是 Docker 的原生集群管理工具。本文将详细介绍 Docker Swarm 的概念、架构、配置方法和最佳实践。

## Swarm 基础概念

### 什么是 Docker Swarm？

Docker Swarm 是 Docker 的原生集群管理和编排工具，它允许 IT 管理员和开发人员在多个 Docker 主机上创建和管理容器集群。

### Swarm 的主要特性

1. **集群管理集成**：使用 Docker Engine CLI 管理集群
2. **分散式设计**：采用分散式设计，无单点故障
3. **声明式服务模型**：声明所需的服务状态
4. **服务扩展**：支持服务的动态扩展
5. **状态协调**：自动协调服务状态
6. **多主机网络**：支持多主机网络
7. **服务发现**：内置服务发现机制
8. **负载均衡**：内置负载均衡功能
9. **安全通信**：节点间的安全通信
10. **滚动更新**：支持服务的滚动更新

## Swarm 架构

### 节点类型

1. **管理节点（Manager Nodes）**
   - 维护集群状态
   - 调度服务
   - 提供 Swarm API

2. **工作节点（Worker Nodes）**
   - 执行容器
   - 不参与集群管理决策
   - 只执行管理节点分配的任务

### 服务和任务

1. **服务（Services）**
   - 定义要在管理节点或工作节点上运行的任务
   - 是集群的中心结构

2. **任务（Tasks）**
   - 服务的执行单元
   - 每个任务代表一个容器实例

## Swarm 集群管理

### 初始化 Swarm

```bash
# 初始化 Swarm 集群
docker swarm init --advertise-addr <MANAGER-IP>

# 查看加入命令
docker swarm join-token worker  # 获取工作节点加入命令
docker swarm join-token manager # 获取管理节点加入命令
```

### 节点管理

```bash
# 列出节点
docker node ls

# 查看节点详细信息
docker node inspect <NODE-ID>

# 提升节点为管理节点
docker node promote <NODE-ID>

# 降级管理节点为工作节点
docker node demote <NODE-ID>

# 删除节点
docker node rm <NODE-ID>

# 更新节点
docker node update --availability drain <NODE-ID>
```

### 标签和约束

```bash
# 添加节点标签
docker node update --label-add region=us-east <NODE-ID>

# 使用标签约束部署服务
docker service create \
  --constraint 'node.labels.region==us-east' \
  nginx
```

## 服务管理

### 创建服务

```bash
# 创建基本服务
docker service create --name my-web nginx

# 创建带有复制数量的服务
docker service create \
  --name my-web \
  --replicas 3 \
  nginx

# 创建带有配置的服务
docker service create \
  --name my-web \
  --publish 80:80 \
  --replicas 3 \
  --mount type=volume,source=my-vol,target=/app \
  --env MYSQL_ROOT_PASSWORD=secret \
  nginx
```

### 服务管理命令

```bash
# 列出服务
docker service ls

# 查看服务详情
docker service inspect my-web

# 查看服务日志
docker service logs my-web

# 查看服务任务
docker service ps my-web

# 更新服务
docker service update \
  --image nginx:1.21 \
  --update-parallelism 2 \
  --update-delay 20s \
  my-web

# 扩展服务
docker service scale my-web=5

# 删除服务
docker service rm my-web
```

### 服务配置

```bash
# 配置更新策略
docker service create \
  --name my-web \
  --update-delay 10s \
  --update-parallelism 2 \
  --update-failure-action rollback \
  nginx

# 配置重启策略
docker service create \
  --name my-web \
  --restart-condition any \
  --restart-delay 5s \
  --restart-max-attempts 3 \
  nginx

# 配置资源限制
docker service create \
  --name my-web \
  --limit-cpu 0.5 \
  --limit-memory 512M \
  nginx
```

## 网络管理

### 创建覆盖网络

```bash
# 创建覆盖网络
docker network create \
  --driver overlay \
  --attachable \
  my-network

# 创建加密的覆盖网络
docker network create \
  --driver overlay \
  --opt encrypted \
  my-secure-network
```

### 服务网络配置

```bash
# 将服务连接到网络
docker service create \
  --name my-web \
  --network my-network \
  nginx

# 将服务连接到多个网络
docker service create \
  --name my-web \
  --network frontend \
  --network backend \
  nginx
```

## 数据管理

### 配置管理

```bash
# 创建配置
docker config create nginx.conf nginx.conf

# 使用配置
docker service create \
  --name my-web \
  --config source=nginx.conf,target=/etc/nginx/nginx.conf \
  nginx
```

### 密钥管理

```bash
# 创建密钥
docker secret create my-secret secret.txt

# 使用密钥
docker service create \
  --name my-web \
  --secret my-secret \
  nginx
```

## 高可用性配置

### 管理节点高可用

```bash
# 配置管理节点
docker swarm init --advertise-addr <MANAGER1-IP>

# 添加额外的管理节点
docker swarm join --token <MANAGER-TOKEN> <MANAGER1-IP>:2377

# 配置管理节点仲裁
docker swarm update --task-history-limit 5
```

### 备份和恢复

```bash
# 备份 Swarm 状态
tar -zvcf swarm-backup.tar.gz /var/lib/docker/swarm/

# 恢复 Swarm 状态
tar -zxvf swarm-backup.tar.gz -C /var/lib/docker/swarm/
```

## 监控和日志

### 服务监控

```bash
# 查看服务状态
docker service ps my-web

# 查看服务日志
docker service logs my-web

# 查看节点资源使用
docker node inspect <NODE-ID>
```

### 使用外部监控工具

```yaml
# docker-compose.yml for monitoring
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

## 安全配置

### TLS 配置

```bash
# 创建 CA 和证书
docker swarm init --external-ca
```

### 防火墙配置

需要开放的端口：
- TCP 2377：集群管理通信
- TCP/UDP 7946：节点间通信
- UDP 4789：覆盖网络流量

```bash
# 配置防火墙规则
ufw allow 2377/tcp
ufw allow 7946/tcp
ufw allow 7946/udp
ufw allow 4789/udp
```

## 生产环境最佳实践

### 1. 高可用性配置

```bash
# 使用奇数个管理节点（推荐3或5个）
docker swarm init
docker swarm join-token manager # 添加其他管理节点
```

### 2. 服务部署策略

```bash
# 使用更新策略
docker service create \
  --name my-web \
  --replicas 3 \
  --update-parallelism 1 \
  --update-delay 30s \
  --update-failure-action rollback \
  nginx
```

### 3. 资源管理

```bash
# 设置资源限制
docker service create \
  --name my-web \
  --limit-cpu 0.5 \
  --limit-memory 512M \
  --reserve-cpu 0.2 \
  --reserve-memory 256M \
  nginx
```

### 4. 网络隔离

```bash
# 创建隔离的网络
docker network create --driver overlay --internal backend
```

### 5. 日志管理

```bash
# 配置日志驱动
docker service create \
  --name my-web \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

## 故障排查

### 常见问题解决

1. **节点通信问题**
```bash
# 检查节点状态
docker node ls
# 检查网络连接
docker network inspect ingress
```

2. **服务部署问题**
```bash
# 检查服务状态
docker service ps --no-trunc my-web
# 查看详细日志
docker service logs my-web
```

3. **网络问题**
```bash
# 检查网络连接
docker network inspect overlay-network
# 测试容器间通信
docker exec -it container1 ping container2
```

## 实际应用案例

### 1. Web 应用部署

```yaml
version: '3.8'
services:
  web:
    image: nginx
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
    ports:
      - "80:80"
    networks:
      - frontend

  api:
    image: api-service
    deploy:
      replicas: 2
    networks:
      - frontend
      - backend

  db:
    image: postgres
    deploy:
      placement:
        constraints:
          - node.role == worker
    networks:
      - backend
    volumes:
      - db-data:/var/lib/postgresql/data

networks:
  frontend:
  backend:
    driver: overlay
    internal: true

volumes:
  db-data:
```

### 2. 负载均衡配置

```bash
# 创建负载均衡服务
docker service create \
  --name lb \
  --publish 80:80 \
  --network frontend \
  nginx

# 配置 DNS 轮询
docker service create \
  --name web \
  --replicas 3 \
  --network frontend \
  --endpoint-mode dnsrr \
  nginx
```

## 总结

Docker Swarm 提供了强大的容器编排和集群管理功能。通过本文的学习，你应该能够：

1. **理解 Swarm 架构**
   - 节点类型和角色
   - 服务和任务概念
   - 集群管理机制

2. **掌握基本操作**
   - 集群的创建和管理
   - 服务的部署和扩展
   - 网络和存储配置

3. **实施最佳实践**
   - 高可用性配置
   - 安全性设置
   - 监控和日志管理
   - 故障排查方法

4. **应用实际场景**
   - Web 应用部署
   - 负载均衡配置
   - 数据持久化
   - 服务发现

在下一章中，我们将探讨 Docker 的企业实践，包括大规模部署、监控告警、持续集成等高级主题。