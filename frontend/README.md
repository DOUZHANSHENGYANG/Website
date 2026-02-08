# Liquid Thoughts 前后端项目

本仓库已调整为前后端分离结构：

- `../frontend`：React + Vite 前端（当前目录）
- `../backend`：Spring Boot 3 + Java 17 后端

## 一、快速启动（本地开发）

> 以下命令基于仓库根目录 `Website/` 执行。

### 1) 启动后端

```bash
cd backend
mvn spring-boot:run
```

- 后端地址：`http://localhost:9002`
- 默认账号：`admin / admin`
- 数据库默认路径：`backend/blog.db`
- 资源目录默认路径：`backend/storage`

可通过环境变量覆盖：

- `BLOG_DB_PATH`
- `BLOG_STORAGE_PATH`

### 2) 启动前端

```bash
cd frontend
npm install
npm run dev
```

- 前端地址：`http://localhost:9001`（Vite 默认端口）
- 前端默认通过 Vite 代理 `/api -> http://localhost:9002`

可在 `frontend/.env.local` 中自定义：

```env
VITE_BACKEND_URL=http://localhost:9002
```

## 二、构建与测试

### 后端测试

```bash
cd backend
mvn clean test
```

### 前端构建

```bash
cd frontend
npm run build
```

## 三、Docker 一键启动

根目录已提供 `docker-compose.yml`，并引用：

- `backend/Dockerfile`
- `frontend/Dockerfile.frontend`
- `frontend/deploy/nginx.conf`

启动：

```bash
docker compose up --build
```

访问：

- 前端：`http://localhost:3000`
- 后端：`http://localhost:8080`（Docker 暴露端口）

## 四、最近 UI 交互修正（2026-02-08）

- 修复从「分类页 / 文章列表」进入「文章检索 / 文章详情」时，页面滚动位置未重置导致的页头视觉错位问题。
  - 现在在进入 `post-search` / `post-detail` 视图时，会自动滚动到页面顶部。
- 顶部导航中的搜索输入框为占位展示，已禁用聚焦输入态（不再出现 focus 扩展与输入光标），避免误操作。
