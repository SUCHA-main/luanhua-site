# AGENTS.md

## 项目目标

「乱花」是一个使用 Astro 构建的个人技术网站，用于展示项目、技术笔记和学习过程。
纯静态站点，构建产物部署到 Vercel / Cloudflare Pages / GitHub Pages。

## 技术栈

- 框架：Astro 5
- 语言：TypeScript（strict 模式）
- 样式：CSS（src/styles/）
- 输出：静态 HTML（dist/）

## 常用命令

| 命令 | 用途 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建静态站点 |
| `npm run preview` | 本地预览构建产物 |
| `npx astro check` | 类型和错误检查 |

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

## 修改规则

- 页面路由由 `src/pages/` 下的文件路径决定，新增/删除页面文件会改变站点路由。
- 组件放在 `src/components/`，布局放在 `src/layouts/`。
- 静态图片放在 `public/images/`。
- 不要手动修改 `dist/`，它是构建产物。
- 不要手动修改 `.astro/`，它是 Astro 生成的类型缓存。
- 不要手动修改 `package-lock.json`。

## 验证要求

每次修改后必须运行：

1. `npm run build` — 确认构建无错误
2. `npx astro check` — 确认类型检查通过
3. `npm run preview` — 在浏览器中确认页面正常

## 不要修改的文件

- `dist/` — 构建产物
- `.astro/` — 类型缓存
- `node_modules/`
- `package-lock.json`（除非确实安装了新依赖）
- `tsconfig.json`（除非有明确理由调整 TypeScript 配置）

## AI 修改代码注意事项

- 新增页面：在 `src/pages/` 下创建 `.astro` 或 `.md` 文件。
- 新增组件：在 `src/components/` 下创建。
- 修改前先阅读相关文件的现有风格，保持一致。
- Astro 组件使用 frontmatter（`---`）写逻辑，HTML 模板写在下方。
- 样式如果写在组件内，使用 `<style>` 标签；全局样式放在 `src/styles/`。
- 修改后必须运行 `npm run build` 验证。
