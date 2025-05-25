# Docker Compose

Docker Compose 是一个用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，你可以使用 YAML 文件来配置应用程序的服务，然后使用一个命令创建并启动所有服务。

## Docker Compose 基础

### 什么是 Docker Compose？

Docker Compose 是一个工具，用于：
- 在单个文件中定义多容器应用
- 使用单个命令管理应用的完整生命周期
- 在开发、测试和生产环境中保持一致性

### 安装 Docker Compose

大多数 Docker Desktop 安装已包含 Docker Compose。如果需要单独安装：

```bash
# Linux 系统安装
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker-compose --version
```

## Docker Compose 文件

### docker-compose.yml 基本结构

```yaml
version: "3.8"  # Compose文件版本

services:       # 定义服务
  web:         # 服务名称
    image: nginx:latest  # 使用的镜像
    ports:     # 端口映射
      - "80:80"
    volumes:   # 数据卷
      - ./html:/usr/share/nginx/html
    
  db:          # 另一个服务
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example
```

### 主要配置项

1. **version**：指定 Compose 文件格式版本
2. **services**：定义应用的各个服务
3. **networks**：定义网络配置
4. **volumes**：定义数据卷
5. **configs**：定义配置文件
6. **secrets**：定义敏感数据

## 服务配置详解

### 基本配置选项

```yaml
services:
  webapp:
    # 指定镜像
    image: nginx:latest
    
    # 或者从Dockerfile构建
    build: 
      context: ./dir
      dockerfile: Dockerfile
      args:
        buildno: 1
        
    # 容器名称
    container_name: my-web-app
    
    # 端口映射
    ports:
      - "80:80"
      - "443:443"
    
    # 环境变量
    environment:
      NODE_ENV: production
      API_KEY: ${API_KEY}
    
    # 数据卷挂载
    volumes:
      - ./data:/data
      - logs:/var/log
    
    # 依赖关系
    depends_on:
      - db
      - redis
    
    # 重启策略
    restart: always
    
    # 网络配置
    networks:
      - frontend
      - backend
```

### 高级配置选项

```yaml
services:
  app:
    # 资源限制
    deploy:
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
    
    # 健康检查
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    # 日志配置
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
    # 用户设置
    user: "1000:1000"
    
    # 工作目录
    working_dir: /app
    
    # 入口点和命令
    entrypoint: /docker-entrypoint.sh
    command: npm start
```

## 网络配置

### 定义网络

```yaml
networks:
  frontend:
    driver: bridge
    
  backend:
    driver: bridge
    internal: true  # 内部网络
    
  custom:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: my-bridge
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
```

### 使用网络

```yaml
services:
  web:
    networks:
      - frontend
      - backend
  
  db:
    networks:
      - backend
```

## 数据卷配置

### 定义数据卷

```yaml
volumes:
  db-data:    # 命名卷
    driver: local
    
  cache:
    driver: local
    driver_opts:
      type: tmpfs
      device: tmpfs
```

### 使用数据卷

```yaml
services:
  db:
    volumes:
      - db-data:/var/lib/mysql    # 使用命名卷
      - ./backup:/backup          # 绑定挂载
      - /tmp/data:/tmp/data      # 主机路径
```

## 环境变量

### 使用 .env 文件

```bash
# .env 文件
DB_NAME=myapp
DB_USER=user
DB_PASS=secret
```

```yaml
# docker-compose.yml
services:
  db:
    environment:
      - DB_NAME=${DB_NAME}
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
```

### 环境变量文件

```yaml
services:
  web:
    env_file:
      - ./web-variables.env
```

## Docker Compose 命令

### 基本命令

```bash
# 启动服务
docker-compose up

# 后台启动
docker-compose up -d

# 停止服务
docker-compose down

# 停止服务并删除数据卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs

# 进入服务容器
docker-compose exec service-name bash

# 构建服务
docker-compose build

# 拉取服务的镜像
docker-compose pull
```

### 服务生命周期管理

```bash
# 启动特定服务
docker-compose start service-name

# 停止特定服务
docker-compose stop service-name

# 重启特定服务
docker-compose restart service-name

# 暂停服务
docker-compose pause service-name

# 恢复服务
docker-compose unpause service-name
```

### 配置验证和调试

```bash
# 验证配置文件
docker-compose config

# 查看服务配置
docker-compose config --services

# 查看容器内进程
docker-compose top
```

## 实际应用案例

### Web应用 + 数据库

```yaml
version: "3.8"

services:
  web:
    build: ./web
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/dbname
    networks:
      - app-network

  db:
    image: postgres:13
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: dbname
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
```

### 微服务架构示例

```yaml
version: "3.8"

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - frontend-network

  backend:
    build: ./backend
    depends_on:
      - db
      - redis
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    networks:
      - frontend-network
      - backend-network

  db:
    image: mysql:8.0
    volumes:
      - db-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    networks:
      - backend-network

  redis:
    image: redis:6
    volumes:
      - redis-data:/data
    networks:
      - backend-network

networks:
  frontend-network:
  backend-network:

volumes:
  db-data:
  redis-data:
```

## 开发环境配置

### 开发环境特定配置

```yaml
# docker-compose.override.yml
services:
  web:
    volumes:
      - ./src:/app/src
    environment:
      DEBUG: "true"
    command: npm run dev
```

### 多环境配置

```bash
# 使用开发环境配置
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# 使用生产环境配置
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 最佳实践

1. **版本控制**
   - 明确指定版本号
   - 将 docker-compose.yml 纳入版本控制
   - 使用 .env 文件管理环境变量

2. **服务组织**
   - 每个服务一个职责
   - 合理使用依赖关系
   - 适当分离网络

3. **配置管理**
   - 使用环境变量
   - 分离敏感信息
   - 使用配置文件

4. **资源管理**
   - 设置资源限制
   - 使用数据卷持久化数据
   - 合理配置日志

5. **安全性**
   - 不在配置文件中存储敏感信息
   - 使用安全的网络配置
   - 定期更新基础镜像

## 常见问题与解决方案

### 服务启动顺序

问题：依赖的服务未就绪
解决方案：
1. 使用 `depends_on`
2. 实现健康检查
3. 使用等待脚本

```yaml
services:
  web:
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### 数据持久化

问题：容器重启数据丢失
解决方案：
1. 使用命名卷
2. 使用绑定挂载
3. 备份重要数据

### 网络连接问题

问题：服务间无法通信
解决方案：
1. 检查网络配置
2. 使用服务名作为主机名
3. 确保服务在同一网络中

## 扩展和高级主题

### 扩展服务

```yaml
services:
  web:
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.50'
          memory: 512M
```

### 使用 Secrets

```yaml
secrets:
  db_password:
    file: ./secrets/db_password.txt

services:
  db:
    secrets:
      - db_password
```

### 使用 Configs

```yaml
configs:
  nginx_config:
    file: ./config/nginx.conf

services:
  web:
    configs:
      - source: nginx_config
        target: /etc/nginx/nginx.conf
```

## 总结

Docker Compose 是一个强大的工具，可以大大简化多容器应用的开发和部署过程。通过本文的学习，你应该能够：

1. 理解 Docker Compose 的基本概念
2. 编写 docker-compose.yml 文件
3. 管理多容器应用
4. 处理常见问题
5. 实施最佳实践

在下一章中，我们将探讨 Docker 网络配置，这是构建分布式应用程序的重要组成部分。