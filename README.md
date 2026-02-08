# Website · Liquid Thoughts

[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB?logo=react&logoColor=white)](#技术栈)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot%203.3-6DB33F?logo=springboot&logoColor=white)](#技术栈)
[![Build](https://img.shields.io/badge/Build-Vite%20%7C%20Maven-646CFF)](#构建与测试)
[![DB](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)](#技术栈)
[![CI](https://github.com/DOUZHANSHENGYANG/Website/actions/workflows/ci.yml/badge.svg)](https://github.com/DOUZHANSHENGYANG/Website/actions/workflows/ci.yml)
[![Deploy Frontend](https://github.com/DOUZHANSHENGYANG/Website/actions/workflows/deploy-vercel.yml/badge.svg)](https://github.com/DOUZHANSHENGYANG/Website/actions/workflows/deploy-vercel.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#开源协议)

一个前后端分离的博客系统，聚焦 **个人写作、内容管理、分类检索与轻量部署**。

> 核心目录：`frontend/`、`backend/`，并包含 GitHub Actions 工作流配置。
---

## 项目亮点

- ✨ 前台站点：文章列表、文章详情、分类浏览、关于页
- 🔎 分类检索：支持关键字、状态、分类、创建/更新时间区间筛选
- 🛠 管理后台：文章/分类/站点配置管理
- 🔐 鉴权机制：基于 JWT 的登录态管理
- 🖼 资源上传：支持头像与内容图片上传
- 📈 指标统计：浏览量与点赞数据记录与展示
- 📄 文档友好：后端提供 Swagger/OpenAPI 文档

---

## 目录结构

```text
.
├─ frontend/      # React + Vite 前端应用
└─ backend/       # Spring Boot 后端服务
```

---

## 技术栈

### Frontend
- React 19
- TypeScript
- Vite 6
- Framer Motion
- React Markdown + remark-gfm

### Backend
- Java 17
- Spring Boot 3.3.x
- MyBatis-Plus 3.5.x
- SQLite
- JWT（鉴权）
- Spring Validation
- Swagger / OpenAPI

### Engineering
- npm（前端依赖与脚本）
- Maven（后端构建与测试）

---

## 功能清单

### 公开站点
- 首页文章流
- 分类页与分类内文章检索
- 文章详情阅读与分享
- 文章点赞/浏览统计展示

### 管理后台
- 登录/退出
- 文章增删改查
- 分类增删改查
- 站点配置（标题、作者、页脚等）
- 文件上传（图片/头像）

---

## 架构概览

```text
[Browser]
    │
    ▼
[frontend: React + Vite]
    │  HTTP / JSON
    ▼
[backend: Spring Boot REST API]
    │
    ├── [SQLite]
    └── [storage/ 文件资源]
```

---

## 快速启动

### 环境要求
- Node.js 18+
- Java 17+
- Maven 3.9+

### 1) 启动后端

```bash
cd backend
mvn spring-boot:run
```

- 默认地址：`http://localhost:9002`
- Swagger：`http://localhost:9002/swagger-ui.html`

### 2) 启动前端

```bash
cd frontend
npm install
npm run dev
```

- 默认地址：`http://localhost:9001`
- 前端通过 `VITE_BACKEND_URL` 指向后端（默认 `http://localhost:9002`）

---

## API 概览

> 详细接口请以 Swagger 为准：`/swagger-ui.html`

- `POST /api/auth/login`：登录
- `POST /api/auth/logout`：退出
- `GET /api/auth/session`：会话状态
- `GET /api/posts` / `GET /api/posts/page`：文章查询
- `POST /api/posts` / `DELETE /api/posts/{id}`：文章管理
- `GET /api/categories` / `GET /api/categories/page`：分类查询
- `POST /api/categories` / `DELETE /api/categories/{id}`：分类管理
- `GET /api/configs` / `POST /api/configs/{key}`：配置管理
- `POST /api/assets/upload`：资源上传

---

## 构建与测试

### 后端
```bash
cd backend
mvn clean test
```

### 前端
```bash
cd frontend
npm run build
```

---

## 免费部署方案（Vercel + Railway）

### 目标域名（推荐命名）
- 前端：`douzhan-web.vercel.app`
- 后端：`douzhan-api-backend-production.up.railway.app`

### 1) 部署后端到 Railway（免费层）

1. 在 Railway 新建项目并连接当前 GitHub 仓库  
2. Service Root Directory 选择 `backend/`  
3. 添加 Volume（建议挂载到 `/data`）  
4. 配置环境变量：
   - `BLOG_DB_PATH=/data/blog.db`
   - `BLOG_STORAGE_PATH=/data/storage`
   - `PORT=8080`（或其它端口，应用已支持 `${PORT}`）
5. 生成 Public Domain，尽量使用包含 `douzhan` 的名称

> 本项目已支持 PaaS 端口注入：`server.port: ${PORT:9002}`。

### 2) 部署前端到 Vercel（免费层）

1. 在 Vercel 导入此仓库  
2. Root Directory 选择 `frontend/`  
3. Framework 选择 Vite（通常自动识别）  
4. 首次部署后，检查 `frontend/vercel.json` 中后端地址是否与你 Railway 域名一致：
   - `/api/*` -> `https://douzhan-api-backend-production.up.railway.app/api/*`
   - `/uploads/*` -> `https://douzhan-api-backend-production.up.railway.app/uploads/*`

### 3) 自动化发布（已配置）

已新增前端自动部署工作流：`.github/workflows/deploy-vercel.yml`  
你只需要在 GitHub 仓库 Secrets 中配置：

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

配置后，每次 push 到 `main` 并命中 `frontend/**` 变更会自动发布到 Vercel 生产环境。
如果 Secrets 未配置，工作流会自动跳过，不会导致 CI 失败。

---

## GitHub 工作流（已配置）

### 1) CI（`.github/workflows/ci.yml`）
- 触发：`push` 到 `main`、`pull_request` 到 `main`、手动触发
- 内容：
  - `frontend`：`npm ci` + `npm run build`
  - `backend`：`mvn clean test`
- 特点：开启并发控制，重复提交会自动取消旧任务

### 2) Dependency Review（`.github/workflows/dependency-review.yml`）
- 触发：`pull_request` 到 `main`
- 内容：检查依赖变更中的已知风险（供应链安全）

### 3) Deploy Frontend to Vercel（`.github/workflows/deploy-vercel.yml`）
- 触发：`push` 到 `main`（`frontend/**` 变更）或手动触发
- 内容：拉取 Vercel 配置、构建并发布 production
- 依赖 Secrets：`VERCEL_TOKEN`、`VERCEL_ORG_ID`、`VERCEL_PROJECT_ID`

---

## Roadmap（计划中）

- [ ] 增加全文搜索能力（可选 ES / SQLite FTS）
- [ ] 增加标签系统与多维筛选
- [ ] 增加评论与审核机制
- [ ] 增加后端自动化部署工作流（Railway）

---

## 贡献指南

欢迎提 Issue / PR。

建议流程：
1. Fork 仓库并创建功能分支
2. 提交清晰的 commit message
3. 本地通过构建与测试后发起 PR
4. 在 PR 中说明变更动机、影响范围与验证方式

---

## 更新记录

- `2026-02-08`
  - 完成前后端目录重构（`frontend/` + `backend/`）
  - 修复公共页滚动定位与头部搜索框交互
  - 完善项目 README（技术栈、功能特点、接口概览、贡献说明）
  - 新增 GitHub Actions：CI + Dependency Review
  - 新增前端自动部署工作流（Vercel）
  - 新增免费部署方案文档（Vercel + Railway）
  - 后端已部署到 Railway：`https://douzhan-api-backend-production.up.railway.app`

---

## 开源协议

本项目采用 **MIT License**。

你可以在保留原作者版权与许可声明的前提下，自由使用、修改、分发本项目代码（包括商业用途）。
