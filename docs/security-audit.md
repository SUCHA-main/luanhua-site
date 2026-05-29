# 安全审计记录

## 审计范围

- 仅本地仓库代码审查，未扫描线上站点
- 未使用破坏性测试工具
- 未执行自动化渗透测试
- 未访问生产环境或敏感数据

## 审计方式

- 手动代码审查：HTML 模板、Astro 组件、外链处理
- 依赖检查：npm audit 结果人工评估
- 配置检查：.gitignore、构建配置、部署配置
- 敏感信息检查：代码中是否硬编码密钥、Token、API Key

## 主要结论

- 未发现密钥泄露
- 未发现 HTML 原始注入风险
- 未发现 API/表单等高风险入口
- 纯静态 Astro 站点，攻击面较小

## 已修复项

### 1. .gitignore 忽略扫描产物

新增 `strix_runs/` 到 `.gitignore`，避免安全扫描产物被误提交。

### 2. 外链 rel 属性补充 noopener noreferrer

修改文件：
- `src/components/FeaturedProjects.astro`
- `src/pages/projects.astro`

修改内容：
```diff
- target="_blank" rel="noreferrer"
+ target="_blank" rel="noopener noreferrer"
```

影响：防止外链页面通过 `window.opener` 访问原页面，提升安全性。

### 3. 新增 Vercel 安全响应头配置

新增 `vercel.json`，配置以下安全头：

| 响应头 | 值 |
|--------|-----|
| Content-Security-Policy | 限制脚本、样式、图片等来源 |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | 禁用摄像头、麦克风、地理位置等 |
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |

## 待后续处理

1. **依赖告警评估**：单独评估 `npm audit` 中 `devalue` 和 Astro 相关依赖的告警，确认是否影响生产环境
2. **安全头验证**：部署到 Vercel 后，使用 `curl -I https://luanhua-site.vercel.app/` 检查安全响应头是否生效
3. **功能扩展审计**：如果后续加入以下功能，需要重新做专项审计：
   - Markdown/MDX 内容渲染
   - 评论系统
   - 搜索功能
   - 表单提交
   - API 路由
   - 用户认证

## 验证结果

```
npm run build     ✅ 通过
npx astro check   ✅ 通过 (0 errors, 0 warnings, 0 hints)
```

## 审计日期

2026-05-28
