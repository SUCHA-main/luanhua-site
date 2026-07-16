---
title: "AI WeChat Digest MVP：从 RSS 到每日晚报"
description: "复盘一个 Mock-first 的 RSS + AI 摘要 MVP：文章抓取、URL 去重、SQLite、偏好评分、Markdown 晚报、推送出口与安全数据边界。"
publishedAt: 2026-07-16
category: "项目复盘"
tags:
  - RSS
  - Node.js
  - SQLite
  - Mock AI
  - Ollama
projectId: "ai-wechat-digest-mvp"
cover: "/projects/ai-wechat-digest-mvp/cover.png"
coverAlt: "AI WeChat Digest MVP 的 RSS 数据源管理界面"
draft: false
---

## 为什么做这个项目

这个项目想处理的是一个很具体的问题：技术信息源很多，但每天真正值得精读的内容有限。与其继续增加订阅，不如先做一条轻量流程，把 RSS 文章收集起来，生成结构化摘要，再按照个人偏好整理成一份可以快速浏览的晚报。

因此，项目的目标不是做一个完整内容平台，而是验证下面这条链路能否在一个小型 MVP 中跑通：

```text
RSS 数据源
  -> 抓取与解析
  -> URL 去重
  -> SQLite 持久化
  -> AI / Mock 总结与偏好评分
  -> Markdown 每日晚报
  -> 前端展示或推送出口
```

> 项目不直接抓取微信页面，也不实现微信公众号发布。公众号内容只能通过外部合法、授权的 RSS-compatible 服务接入。

## 从 RSS 到 SQLite

数据源在 SQLite 的 `sources` 表中维护。首次启动且数据库为空时，程序会从公开的 `sources.json` 种子文件初始化；之后通过页面新增的数据源直接保存在本地数据库。

抓取器只选择 `type === "rss"` 且处于启用状态的数据源，再使用 `rss-parser` 解析。虽然数据源接口可以保存 `json` 类型，但当前抓取实现并不处理 JSON，这一点需要在界面和文档中保持明确。

对每篇 RSS item，程序会提取标题、链接、作者、发布时间和正文。文章 URL 是去重键：

```sql
INSERT INTO articles (...)
VALUES (...)
ON CONFLICT(url) DO NOTHING
```

抓取前还会先按 URL 查询一次。已经存在的文章会计入 skipped，不会重复总结和入库；某一个 RSS 源失败时，错误会记录在本次抓取结果中，不影响其他数据源继续执行。

## 总结、偏好评分和晚报

每篇新文章在写入数据库前都会经过 `summarizeArticle()`。摘要统一包含四部分：

- 一句话总结
- 三个要点
- 1–5 的重要性评分
- 推荐或不推荐继续阅读的理由

本地 `profile.json` 中的兴趣、规避方向和评分规则会参与 AI prompt。Mock 模式也会读取同一份偏好，通过文章标题和正文中的关键词命中情况计算 1–5 分，并生成固定结构的演示摘要。

生成晚报时，程序选择当天或最近 24 小时内的候选文章，再按重要性分组：

| 分数 | 晚报分组 |
| --- | --- |
| 4–5 | 今日最值得看 |
| 2–3 | 可以快速扫一眼 |
| 1 | 可以跳过 |

最终内容以 Markdown 保存到 `digests` 表，同一天重复生成会更新当日记录，而不是继续插入多份晚报。

<figure class="note-figure">
  <img
    src="/projects/ai-wechat-digest-mvp/cover.png"
    alt="AI WeChat Digest MVP 的 RSS 数据源管理界面"
    width="1440"
    height="1100"
    loading="lazy"
    decoding="async"
  />
  <figcaption>公开演示界面使用 Mock AI 和示例 RSS 数据，不包含个人配置或真实凭据。</figcaption>
</figure>

## 为什么默认使用 Mock

Mock 是默认安全演示模式，主要解决三个问题：

1. 不需要 API Key，克隆项目后可以先理解完整流程。
2. 不会因为外部 AI 服务不可用、余额或网络问题中断基础演示。
3. 不需要使用真实文章和真实推送配置完成安全检查。

Mock 不是大模型能力的替代品。它本质上是规则和关键词驱动的摘要结构生成器，适合验证数据流、页面状态和晚报分组，不应被描述为真实 AI 评测结果。

## 可选的 DeepSeek / OpenAI-compatible 与 Ollama

当 `AI_PROVIDER=deepseek` 时，项目使用 OpenAI-compatible Chat Completions 请求。配置由 base URL、model 和 API Key 组成，程序会把 base URL 规范化到 `/chat/completions`：

```bash
AI_PROVIDER=deepseek
AI_API_BASE_URL=https://api.deepseek.com/v1
AI_API_KEY=your-local-key
AI_MODEL=deepseek-chat
```

这里的 provider 名称是 `deepseek`，但调用方式属于 OpenAI-compatible 接口，因此也可以指向其他兼容服务。真实密钥必须保留在本地 `.env`，不能进入仓库。

当 `AI_PROVIDER=ollama` 时，请求发送到本地 Ollama 的 `/api/chat`：

```bash
AI_PROVIDER=ollama
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2.5:3b
```

两种真实 Provider 都要求模型返回严格 JSON，再由 `normalizeSummary()` 统一字段和评分范围。

## AI 失败时如何降级

真实 AI 调用被包在同一个降级边界中：

```js
try {
  return await summarizeWithAI(article, profile);
} catch (error) {
  console.warn(`AI summarize failed, fallback to mock: ${error.message}`);
  return summarizeWithMock(article, profile);
}
```

网络错误、60 秒超时、非成功响应、空内容或无法解析的 JSON 都可能进入这个分支。降级后仍会返回统一格式的摘要和评分，让抓取或重新总结流程可以继续完成。

这个机制提升的是本地 MVP 的可演示性，并不等于生产级容错。项目没有重试队列、熔断、任务持久化或完整可观测性。

## 为什么 profile 和数据库不能提交

`profile.json` 表达的是个人兴趣、希望避开的内容和评分规则。它不一定包含传统意义上的密钥，但仍然属于个人偏好数据，不适合作为公开仓库的默认内容。

SQLite 运行库包含的范围更广：

- 页面新增的数据源 URL
- 抓取后的文章内容
- 生成的摘要与评分
- 每日晚报记录

这些内容会随着本地使用持续变化，也可能包含私人订阅源或未经确认的文章数据。因此，`app.db`、WAL/SHM 文件和本地 `profile.json` 都应该被 Git 忽略。

公开仓库只保留：

- 脱敏的 `profile.example.json`
- 公共演示 RSS seed
- 虚构的 sample articles
- 空值或安全默认值组成的 `.env.example`

## 本轮仓库整理改进了什么

在公开前的整理中，项目没有新增产品功能，而是收紧了文档、配置和数据边界：

- 将本地 `profile.json` 从 Git 跟踪中移除，并加入 `.gitignore` 和 `.dockerignore`。
- 新增脱敏的 `profile.example.json`，本地 profile 不存在时自动回退到示例结构。
- 明确 SQLite、个人偏好、真实密钥和生成晚报都只保留在本地。
- README 改用 `npm ci`，补充中英文配置说明、真实截图和 MIT License。
- 校正 JSON 数据源、Docker 持久化和微信能力边界，避免文档描述超过代码实现。

整理阶段完成了 JavaScript 语法检查、锁文件一致性检查、隔离临时数据库健康检查和 `docker compose config`。没有调用真实 AI、没有抓取真实 RSS、没有发送 PushPlus 或邮件，也没有启用定时推送。Docker daemon 当时不可用，因此没有完成镜像构建验证；项目也没有自动化测试套件。

## 推送出口的真实状态

代码中存在三种推送方式：

- `console`：默认模式，把晚报打印到控制台。
- `pushplus`：需要本地 `PUSHPLUS_TOKEN`。
- `email`：需要完整 SMTP 配置。

PushPlus 和 SMTP 都会检查配置并返回明确错误，但真实邮件和 PushPlus 在本轮整理中没有测试。文章也不提供在线 Demo，不把“接口存在”写成“外部推送已经验证”。

## 当前限制

- 不是生产级 CMS 或内容平台。
- 不直接抓取微信，不处理微信登录、反爬或页面采集。
- 不实现微信公众号发布。
- 当前抓取器只处理 RSS，JSON 数据源尚未实现。
- 没有用户认证和多用户隔离。
- SQLite 与单机定时任务只适合本地 MVP。
- Docker Compose 没有挂载持久化数据库卷。
- 没有自动化测试。
- 真实 AI、真实 RSS 网络抓取、PushPlus、SMTP 和定时执行仍未验证。

## 下一步计划

更合理的下一步不是立即增加更多 Provider，而是先补可靠性和可复现性：

1. 为去重、摘要标准化、Mock fallback 和晚报分组增加单元测试。
2. 增加 GitHub Actions，至少执行语法与测试检查。
3. 为 Docker Compose 增加明确的持久化数据方案。
4. 补充一个合法的 WeWe RSS 接入示例，但仍由外部工具负责生成 RSS。
5. 实现文章搜索、筛选以及晚报历史归档。
6. 在隔离测试账号和明确授权下，再分别验证真实 AI、PushPlus 与 SMTP。

项目详情和源码可以从[项目作品页](/projects#ai-wechat-digest-mvp)继续查看。
