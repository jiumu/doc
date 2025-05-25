# Docker 安装指南

本指南将介绍如何在各种操作系统上安装 Docker。我们将覆盖最常用的操作系统，并提供详细的安装步骤。

## 系统要求

在安装 Docker 之前，请确保您的系统满足以下基本要求：

### Linux 系统要求
- 64 位操作系统
- Linux 内核版本 3.10 或更高
- 推荐 4GB 以上内存

### Windows 系统要求
- Windows 10 64位：专业版、企业版或教育版
- 启用 Hyper-V 和容器功能
- 推荐 4GB 以上内存

### macOS 系统要求
- macOS 10.14 (Mojave) 或更高版本
- 推荐 4GB 以上内存

## Linux 安装指南

### Ubuntu 安装 Docker

1. 更新软件包索引：
```bash
sudo apt-get update
```

2. 安装必要的依赖：
```bash
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

3. 添加 Docker 的官方 GPG 密钥：
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

4. 设置稳定版仓库：
```bash
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

5. 安装 Docker Engine：
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

### CentOS 安装 Docker

1. 卸载旧版本（如果有）：
```bash
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

2. 安装所需包：
```bash
sudo yum install -y yum-utils
```

3. 设置仓库：
```bash
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

4. 安装 Docker Engine：
```bash
sudo yum install docker-ce docker-ce-cli containerd.io
```

5. 启动 Docker：
```bash
sudo systemctl start docker
```

## Windows 安装指南

### Windows 10/11 专业版安装 Docker Desktop

1. 从 [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-windows/) 下载 Docker Desktop Installer.exe

2. 确保 Windows 功能已启用：
   - Hyper-V
   - 容器功能
   - 虚拟机平台

3. 运行安装程序，按照向导完成安装

4. 安装完成后重启电脑

### Windows 10 家庭版安装 Docker

1. 安装 WSL2（Windows Subsystem for Linux 2）
2. 从 Docker Hub 下载 Docker Desktop Installer
3. 按照安装向导完成安装
4. 确保在设置中启用 WSL2 后端

## macOS 安装指南

### 使用 Homebrew 安装

1. 安装 Homebrew（如果尚未安装）：
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安装 Docker Desktop：
```bash
brew install --cask docker
```

### 手动安装

1. 从 [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) 下载 Docker.dmg
2. 双击 DMG 文件
3. 将 Docker 拖到应用程序文件夹
4. 从启动台运行 Docker

## 验证安装

安装完成后，运行以下命令验证安装：

1. 检查 Docker 版本：
```bash
docker --version
```

2. 检查 Docker 是否正常运行：
```bash
docker run hello-world
```

3. 查看 Docker 系统信息：
```bash
docker info
```

## 配置 Docker

### 1. 配置 Docker 用户组（Linux）

为避免每次使用 docker 命令都需要 sudo：

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

注销并重新登录后生效。

### 2. 配置 Docker 镜像加速

#### Linux 系统配置

创建或修改 `/etc/docker/daemon.json`：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

重启 Docker 服务：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### Windows/macOS 配置

1. 打开 Docker Desktop
2. 进入设置（Settings）
3. 找到 Docker Engine
4. 添加上述镜像地址
5. 点击 Apply & Restart

## 常见问题解决

### 1. 权限问题（Linux）

问题：Permission denied
解决：将用户添加到 docker 组（见上文配置部分）

### 2. 启动失败

问题：Docker 服务无法启动
解决步骤：
1. 检查系统日志：`journalctl -u docker.service`
2. 确保系统满足要求
3. 重启 Docker 服务

### 3. 网络问题

问题：无法拉取镜像
解决方案：
1. 检查网络连接
2. 配置镜像加速器
3. 检查防火墙设置

### 4. WSL2 相关问题（Windows）

问题：WSL2 安装或更新失败
解决：
1. 确保 Windows 更新到最新版本
2. 手动下载并安装 WSL2 内核更新包
3. 在 PowerShell 中运行 `wsl --update`

## 卸载 Docker

### Linux（Ubuntu）卸载
```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

### Windows 卸载
1. 从控制面板卸载 Docker Desktop
2. 删除 `%ProgramData%\Docker` 文件夹

### macOS 卸载
1. 从应用程序文件夹删除 Docker.app
2. 运行清理命令：
```bash
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/.docker
```

## 下一步

安装完成后，建议：

1. 运行一些基本的 Docker 命令来熟悉操作
2. 阅读 Docker 基本命令章节
3. 尝试拉取和运行一些简单的容器
4. 配置开发环境

## 参考资源

- [Docker 官方文档](https://docs.docker.com/engine/install/)
- [Docker Hub](https://hub.docker.com/)
- [Docker 社区论坛](https://forums.docker.com/)