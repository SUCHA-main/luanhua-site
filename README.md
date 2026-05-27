# 乱花 luanhua-site

一个用 Astro 构建的个人网站，用来整理技术项目、学习笔记和阶段性成长记录。

## 项目简介

这是乱花的个人网站项目，用来展示当前关注方向、技术项目、学习笔记和阶段性复盘。

网站不是成熟商业官网，而是一个持续迭代的个人作品集入口。

## 当前页面

| 页面 | 说明 |
|------|------|
| 首页 | Hero 区、当前关注方向、精选项目展示 |
| 项目页 | 展示 Go WebSocket Chatroom、AI WeChat Digest MVP、LabelHub AI MVP、CI/CD Lab、Fooocus 中文本地 UI 补丁、luanhua-site |
| 笔记页 | 整理项目复盘、AI 应用笔记、DevOps 实验记录、AIoT / 物联网准备 |
| 关于页 | 介绍当前学习方向、项目经历、学习方式和下一阶段计划 |

## 技术栈

- **框架**：Astro 5
- **语言**：TypeScript
- **样式**：原生 CSS
- **输出**：静态站点
- **布局**：响应式设计

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

构建静态站点：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

### 环境要求

- Node.js >= 18

### 类型检查

```bash
npx astro check
```

## 项目结构

```text
src/
├── components/   # Astro 组件
├── layouts/      # 页面布局
├── pages/        # 路由页面（文件即路由）
├── styles/       # 全局样式
public/
└── images/       # 静态图片资源
```

构建产物输出到 `dist/`，部署时使用该目录。

## 当前状态

- ✅ 已完成首页、项目页、笔记页、关于页基础优化
- ✅ 已完成本地构建验证
- ✅ 已添加基础响应式适配
- ✅ 已添加项目 GitHub 链接（Go WebSocket Chatroom、LabelHub AI MVP、Fooocus）
- ⚠️ Notes 内容仍以待整理入口为主
- ⚠️ 后续会继续补充项目详情和真实笔记内容

## 后续计划

- 补充项目详情内容
- 增加真实技术笔记
- 做部署与线上访问
- 补充截图
- 继续优化移动端体验

## 部署

### Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 中导入仓库。
3. Framework Preset 选择 `Astro`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。

### Cloudflare Pages

1. 将项目推送到 GitHub。
2. 在 Cloudflare Pages 中连接仓库。
3. Framework preset 选择 `Astro`。
4. Build command 使用 `npm run build`。
5. Build output directory 使用 `dist`。

### GitHub Pages

1. 将项目推送到 GitHub。
2. 在仓库 Settings > Pages 中配置。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，文件夹选择 `/ (root)`。
5. 保存后等待部署完成。

## 隐私说明

本仓库不包含 API Key、Token、.env、本地服务账号或敏感环境配置。
