# Docker 最佳实践

本文总结了 Docker 使用过程中的最佳实践，包括安全性、性能优化、开发流程等方面，帮助你更高效、安全地使用 Docker。

## 安全性最佳实践

### 1. 容器安全基础

#### 使用非 root 用户运行容器

```dockerfile
# 在 Dockerfile 中创建并使用非 root 用户
RUN useradd -r -s /bin/false appuser
USER appuser
```

```bash
# 运行时指定用户
docker run --user 1000:1000 nginx
```

#### 限制容器功能

```bash
# 删除所有功能并只添加需要的功能
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx
```

#### 使用只读文件系统

```bash
# 使用只读根文件系统
docker run --read-only nginx

# 为特定目录提供写入权限
docker run --read-only --tmpfs /tmp nginx
```

### 2. 镜像安全

#### 使用官方和可信的基础镜像

```dockerfile
# 使用官方镜像
FROM node:16-alpine

# 指定确切版本，避免使用 latest
FROM ubuntu:20.04
```

#### 定期更新基础镜像

```bash
# 拉取最新的基础镜像
docker pull nginx:1.21

# 重新构建应用镜像
docker build -t my-app .
```

#### 扫描镜像漏洞

```bash
# 使用 Docker Scan
docker scan my-image:latest

# 使用第三方工具如 Trivy
trivy image my-image:latest
```

#### 使用多阶段构建减少攻击面

```dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 3. 运行时安全

#### 限制资源使用

```bash
# 限制内存
docker run --memory 512m nginx

# 限制 CPU
docker run --cpus 0.5 nginx
```

#### 使用安全计算配置文件

```bash
# 应用默认的 seccomp 配置文件
docker run --security-opt seccomp=default.json nginx
```

#### 使用网络隔离

```bash
# 创建内部网络
docker network create --internal backend

# 将容器连接到内部网络
docker run --network backend postgres
```

#### 使用健康检查

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

### 4. 敏感数据管理

#### 使用 Docker Secrets

```bash
# 创建 secret
echo "my_secret_password" | docker secret create db_password -

# 在服务中使用 secret
docker service create \
  --name db \
  --secret db_password \
  postgres
```

#### 使用环境变量文件

```bash
# 创建环境变量文件
cat > .env << EOF
DB_USER=user
DB_PASS=password
EOF

# 使用环境变量文件
docker run --env-file .env postgres
```

#### 避免在镜像中包含敏感数据

```dockerfile
# 错误示例
FROM ubuntu
COPY credentials.json /app/

# 正确示例
FROM ubuntu
# 在运行时挂载或使用环境变量
```

## 性能优化

### 1. 镜像优化

#### 使用轻量级基础镜像

```dockerfile
# 使用 Alpine 版本
FROM node:16-alpine

# 使用 slim 版本
FROM python:3.9-slim
```

#### 减少镜像层数

```dockerfile
# 合并 RUN 指令
RUN apt-get update && \
    apt-get install -y package1 package2 && \
    rm -rf /var/lib/apt/lists/*
```

#### 清理不必要的文件

```dockerfile
RUN apt-get update && \
    apt-get install -y package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

#### 使用 .dockerignore 文件

```
# .dockerignore
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
```

### 2. 构建优化

#### 优化构建缓存

```dockerfile
# 先复制依赖文件
COPY package.json package-lock.json ./
RUN npm ci

# 再复制源代码
COPY . .
```

#### 使用多阶段构建

```dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

#### 使用 BuildKit

```bash
# 启用 BuildKit
export DOCKER_BUILDKIT=1

# 使用 BuildKit 构建
docker build --progress=plain .
```

### 3. 运行时优化

#### 合理设置资源限制

```bash
# 设置内存限制
docker run --memory 512m --memory-swap 1g nginx

# 设置 CPU 限制
docker run --cpus 0.5 nginx
```

#### 使用数据卷优化 I/O 性能

```bash
# 使用命名卷
docker run -v data-volume:/app/data nginx

# 使用绑定挂载的缓存选项
docker run -v /host/path:/container/path:cached nginx
```

#### 优化网络配置

```bash
# 使用主机网络模式（适用于高性能场景）
docker run --network host nginx

# 使用自定义网络
docker network create --driver bridge --opt com.docker.network.bridge.name=my-bridge my-network
```

## 开发流程最佳实践

### 1. 开发环境

#### 使用 Docker Compose 管理开发环境

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
  
  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=password

volumes:
  node_modules:
  db-data:
```

#### 使用开发专用的 Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
```

#### 使用热重载

```yaml
# docker-compose.yml
services:
  app:
    volumes:
      - .:/app
    command: npm run dev
```

### 2. 测试实践

#### 在容器中运行测试

```bash
# 运行测试
docker run --rm my-app npm test

# 使用 Docker Compose 运行测试
docker-compose run --rm app npm test
```

#### 使用专门的测试阶段

```dockerfile
FROM node:16 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS test
COPY . .
CMD ["npm", "test"]

FROM base AS build
COPY . .
RUN npm run build
```

#### 集成 CI/CD

```yaml
# .github/workflows/docker.yml
name: Docker CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and test
        run: |
          docker build -t my-app .
          docker run --rm my-app npm test
```

### 3. 生产部署

#### 使用多环境配置

```bash
# 开发环境
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 生产环境
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

#### 实施蓝绿部署

```bash
# 部署新版本（绿）
docker service update --image my-app:v2 my-service

# 回滚到旧版本（蓝）
docker service update --rollback my-service
```

#### 使用健康检查和自动重启

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

```bash
docker run --restart=unless-stopped my-app
```

## 容器编排最佳实践

### 1. Docker Compose 最佳实践

#### 使用版本控制

```yaml
version: '3.8'  # 使用最新的稳定版本
```

#### 使用环境变量

```yaml
services:
  app:
    image: my-app:${APP_VERSION:-latest}
    environment:
      - DB_HOST=${DB_HOST:-db}
      - DB_PASSWORD=${DB_PASSWORD}
```

#### 分离开发和生产配置

```
project/
├── docker-compose.yml         # 基础配置
├── docker-compose.dev.yml     # 开发环境配置
└── docker-compose.prod.yml    # 生产环境配置
```

### 2. Docker Swarm 最佳实践

#### 使用服务约束

```bash
docker service create \
  --constraint 'node.role==worker' \
  --constraint 'node.labels.region==us-west' \
  nginx
```

#### 配置服务更新策略

```yaml
services:
  web:
    image: nginx
    deploy:
      update_config:
        parallelism: 2
        delay: 10s
        order: start-first
```

#### 使用配置和密钥

```yaml
services:
  web:
    image: nginx
    configs:
      - source: nginx_config
        target: /etc/nginx/nginx.conf
    secrets:
      - source: ssl_cert
        target: /etc/nginx/ssl/cert.pem

configs:
  nginx_config:
    file: ./nginx.conf

secrets:
  ssl_cert:
    file: ./ssl/cert.pem
```

### 3. Kubernetes 最佳实践

#### 使用资源请求和限制

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:1.0
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

#### 实施健康检查

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: app
    image: my-app:1.0
    livenessProbe:
      httpGet:
        path: /health
        port: 8080
      initialDelaySeconds: 15
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
```

#### 使用命名空间隔离

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: development

---
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  namespace: development
spec:
  containers:
  - name: app
    image: my-app:1.0
```

## 监控和日志最佳实践

### 1. 容器日志管理

#### 配置日志驱动

```bash
# 使用 json-file 驱动并限制大小
docker run \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  nginx
```

#### 集中式日志收集

```yaml
# docker-compose.yml
services:
  app:
    image: my-app
    logging:
      driver: "fluentd"
      options:
        fluentd-address: localhost:24224
        tag: app.{{.Name}}
```

#### 结构化日志

```javascript
// 在应用中使用结构化日志
console.log(JSON.stringify({
  level: 'info',
  message: 'User logged in',
  userId: 123,
  timestamp: new Date().toISOString()
}));
```

### 2. 监控容器

#### 使用 Docker Stats

```bash
# 查看容器资源使用情况
docker stats

# 自定义输出格式
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

#### 使用 Prometheus 和 Grafana

```yaml
# docker-compose.yml
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

#### 设置告警

```yaml
# prometheus.yml
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - alertmanager:9093

rule_files:
  - 'alert.rules'
```

## 数据管理最佳实践

### 1. 数据持久化

#### 使用命名卷

```bash
# 创建命名卷
docker volume create my-data

# 使用命名卷
docker run -v my-data:/app/data nginx
```

#### 实施备份策略

```bash
# 备份数据卷
docker run --rm \
  -v my-data:/source \
  -v $(pwd):/backup \
  alpine tar czf /backup/my-data-backup.tar.gz -C /source .
```

#### 使用卷驱动程序

```bash
# 创建使用特定驱动程序的卷
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.1,rw \
  --opt device=:/path/to/dir \
  my-nfs-volume
```

### 2. 数据库最佳实践

#### 使用初始化脚本

```dockerfile
# 将初始化脚本复制到特定目录
COPY init.sql /docker-entrypoint-initdb.d/
```

#### 配置数据库参数

```yaml
services:
  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
```

#### 实施数据库备份

```bash
# 备份 PostgreSQL 数据库
docker exec -t my-postgres pg_dumpall -c -U postgres > dump.sql

# 备份 MySQL 数据库
docker exec my-mysql sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > all-databases.sql
```

## 网络最佳实践

### 1. 网络隔离

#### 使用自定义网络

```bash
# 创建自定义网络
docker network create app-network

# 将容器连接到网络
docker run --network app-network my-app
```

#### 实施网络分段

```yaml
# docker-compose.yml
services:
  web:
    networks:
      - frontend
  
  app:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend

networks:
  frontend:
  backend:
    internal: true  # 内部网络，不能访问外部
```

#### 使用网络策略

```bash
# 限制容器间通信
docker run --link db:db --network-alias app my-app
```

### 2. 服务发现

#### 使用 DNS

```bash
# 在自定义网络中使用 DNS
docker run --network app-network my-app ping db
```

#### 使用环境变量

```yaml
services:
  app:
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
```

#### 使用服务发现工具

```yaml
services:
  consul:
    image: consul
    ports:
      - "8500:8500"
  
  app:
    environment:
      - CONSUL_HTTP_ADDR=consul:8500
```

## 自动化和 CI/CD 最佳实践

### 1. 自动化构建

#### 使用 Makefile

```makefile
.PHONY: build test push

build:
	docker build -t my-app:latest .

test:
	docker run --rm my-app npm test

push: build test
	docker push my-app:latest
```

#### 使用 Docker Hub 自动构建

```yaml
# hooks/build
#!/bin/bash
docker build --build-arg VERSION=$(git describe --tags) -t $IMAGE_NAME .
```

#### 使用 GitHub Actions

```yaml
# .github/workflows/docker.yml
name: Docker

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1
      
      - name: Login to DockerHub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          push: true
          tags: user/app:latest
```

### 2. 持续集成

#### 使用 Docker 进行测试

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - docker build -t my-app:$CI_COMMIT_SHA .

test:
  stage: test
  script:
    - docker run --rm my-app:$CI_COMMIT_SHA npm test
```

#### 使用并行测试

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [12.x, 14.x, 16.x]
    steps:
      - uses: actions/checkout@v2
      - name: Test with Node.js ${{ matrix.node-version }}
        run: |
          docker build --build-arg NODE_VERSION=${{ matrix.node-version }} -t my-app:${{ matrix.node-version }} .
          docker run --rm my-app:${{ matrix.node-version }} npm test
```

### 3. 持续部署

#### 使用 Docker Swarm 部署

```bash
# 部署或更新服务
docker stack deploy -c docker-compose.yml my-app
```

#### 使用 Kubernetes 部署

```bash
# 应用 Kubernetes 配置
kubectl apply -f kubernetes/
```

#### 实施金丝雀部署

```yaml
# docker-compose.yml
services:
  app:
    image: my-app:${VERSION:-latest}
    deploy:
      replicas: 5
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
        failure_action: rollback
```

## 总结

Docker 最佳实践涵盖了多个方面，包括：

1. **安全性**
   - 使用非 root 用户
   - 限制容器功能
   - 扫描镜像漏洞
   - 安全管理敏感数据

2. **性能优化**
   - 使用轻量级基础镜像
   - 减少镜像层数
   - 优化构建缓存
   - 合理设置资源限制

3. **开发流程**
   - 使用 Docker Compose 管理开发环境
   - 在容器中运行测试
   - 实施 CI/CD 流程
   - 使用多环境配置

4. **容器编排**
   - 使用服务约束和更新策略
   - 配置健康检查
   - 实施资源管理
   - 使用网络隔离

5. **监控和日志**
   - 配置日志驱动
   - 使用结构化日志
   - 实施监控和告警
   - 集中式日志收集

6. **数据管理**
   - 使用命名卷
   - 实施备份策略
   - 配置数据库参数
   - 使用卷驱动程序

7. **网络配置**
   - 使用自定义网络
   - 实施网络分段
   - 配置服务发现
   - 使用网络策略

8. **自动化和 CI/CD**
   - 自动化构建过程
   - 使用持续集成
   - 实施持续部署
   - 配置自动测试

通过遵循这些最佳实践，你可以构建更安全、更高效、更可靠的容器化应用程序。