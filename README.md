# 乱花

一个使用 Astro 构建的个人技术网站，用于展示项目、技术笔记和学习过程。

## 页面结构

- `/` 首页
- `/projects` 项目作品
- `/notes` 技术笔记
- `/about` 关于我

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

### 项目结构

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

## 后续扩展

- 将技术笔记迁移为 Markdown 内容集合。
- 为项目卡片补充 GitHub 链接和部署地址。
- 添加 RSS、站点地图和基础 SEO 信息。
