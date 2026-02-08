# Website · Liquid Thoughts 博客系统

一个前后端分离的博客系统，面向**个人写作 + 后台内容管理**场景。

## 项目说明

本项目包含公开访问站点与管理后台两部分能力，支持文章发布、分类管理、内容检索、点赞/浏览统计等核心功能。

> 当前仓库按你要求，仅保留：`frontend/`、`backend/`、`README.md`。

## 目录结构

```text
.
├─ frontend/    # React + Vite 前端
└─ backend/     # Spring Boot 后端
```

## 技术栈

### Frontend
- React 19 + TypeScript
- Vite 6
- Framer Motion（动效）
- React Markdown + remark-gfm（Markdown 渲染）
- Lucide React / Material Symbols（图标）

### Backend
- Java 17
- Spring Boot 3.3.x
- MyBatis-Plus 3.5.x
- SQLite
- JWT 鉴权
- Spring Validation
- Swagger / OpenAPI

### 工程与运行
- Maven（后端构建）
- npm（前端依赖管理）
- Docker Compose（可选）

## 功能特点

- ✅ 前台文章浏览、分类浏览、文章详情页
- ✅ 分类文章检索（关键字、状态、分类、时间区间）
- ✅ 后台登录鉴权（JWT）
- ✅ 文章管理（新建 / 编辑 / 删除 / 状态管理）
- ✅ 分类管理（增删改查）
- ✅ 站点配置管理（如标题、页脚、作者信息）
- ✅ 文件上传（图片资源、头像等）
- ✅ 文章浏览量/点赞统计与展示
- ✅ OpenAPI 文档可视化

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
- 默认代理后端：`http://localhost:9002`

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

## 开源协议

本项目采用 **MIT License** 开源。

你可以自由地使用、修改和分发本项目代码（包括商业用途），但需保留原始版权与许可声明。

---
如果你希望，我下一步可以再帮你补一版「更偏产品介绍风格」README（加截图区、架构图、Roadmap、贡献指南）。
