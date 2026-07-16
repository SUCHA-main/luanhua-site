---
title: "Mini Provider Gateway：密钥、日志与安全边界"
description: "复盘一个个人 AI Provider Gateway MVP 的真实安全取舍：三类凭据、哈希存储、Provider Key 边界、脱敏日志和从本地 MVP 走向生产系统仍缺少的能力。"
publishedAt: 2026-07-16T18:30:00+08:00
category: "项目复盘"
tags:
  - AI Gateway
  - Node.js
  - SQLite
  - API Security
  - Docker
projectId: "mini-provider-gateway-portal"
cover: "/projects/mini-provider-gateway-portal/cover.png"
coverAlt: "Mini Provider Gateway Portal 的本地管理仪表盘"
draft: false
---

## 为什么需要一个统一的 Provider Gateway

在不同项目里直接接入 Ollama、DeepSeek 或其他 OpenAI-compatible 服务，很快会遇到重复问题：每个应用都要保存 Provider 地址和密钥，每个调用方都要分别处理鉴权、模型配置和错误格式，也很难从一个地方看到调用状态。

Mini Provider Gateway Portal 想验证的是一条更集中的本地链路：

```text
Consumer App
  -> Consumer Key 鉴权
  -> 选择已启用的 Provider
  -> Ollama / OpenAI-compatible Adapter
  -> 基础非流式 Chat Completions
  -> 返回结果并记录脱敏调用元数据
```

项目是一个**个人 AI Provider Gateway MVP**。它适合学习 Provider 管理、调用代理和凭据边界，不应直接宣传为生产级网关。

## 三类凭据解决不同问题

项目里容易混淆的不是“有没有 Key”，而是三类凭据的职责完全不同。

| 凭据 | 使用者 | 解决的问题 | 当前存储位置 |
| --- | --- | --- | --- |
| Provider Key | Gateway 后端 | 代表网关调用上游 AI Provider | 本地 SQLite，当前明文存储 |
| Consumer Key | 调用 Gateway 的应用 | 识别和校验具体 Consumer | 数据库只保存 SHA-256 哈希和短前缀 |
| Admin Token | 管理页面和管理 API | 保护 Provider、Consumer 与日志管理接口 | 后端环境变量；前端使用时保存在 localStorage |

这种拆分让调用方不需要直接接触 Provider Key，也让管理操作与普通模型调用使用不同的鉴权入口。但“职责分开”不等于已经达到生产级安全。

## Consumer Key 为什么只存哈希

Consumer Key 在创建或轮换时随机生成，只返回一次完整值。后端随后保存：

- SHA-256 哈希
- 用于界面识别的短前缀
- Consumer 名称、启用状态和 Provider 范围等元数据

后续请求到达 `/v1/chat/completions` 时，认证中间件会对传入 Key 计算哈希，再通过 timing-safe comparison 与数据库记录比较。

```text
传入 Consumer Key
  -> SHA-256
  -> 与 key_hash 做定时安全比较
  -> 找到启用的 Consumer
```

这样数据库不需要保存可直接使用的 Consumer Key。项目使用的是高熵随机 Key，不是用户选择的短密码；哈希在这里用于验证随机凭据，而不是替代完整的密码存储体系。

## Provider Key 为什么不能返回前端

Provider Key 是网关调用上游服务时真正使用的凭据。它只应该在后端 Adapter 组装上游请求时进入 `Authorization` 请求头。

Provider 管理接口在读取数据库记录时会移除完整 `api_key`，只返回掩码字段。前端编辑 Provider 时也不会从服务端拿回原始值：留空表示继续使用旧值，只有明确输入新值时才更新。

这条边界很重要，因为浏览器中的脚本、扩展、日志或截图都不应获得完整 Provider Key。Consumer App 只需要自己的 Consumer Key，不应该知道网关背后使用了哪一个上游凭据。

## Provider Key 当前仍是明文存储

当前 Provider Key **未加密存储**。SQLite 的 `providers.api_key` 字段保存明文，因为后端发起上游请求时必须恢复原始值。

这意味着：

- 获得本地数据库文件读取权限的人，也可能获得 Provider Key。
- 数据库备份、复制和调试文件都需要按敏感配置处理。
- 仅仅把数据库加入 `.gitignore`，不能解决本机权限、备份泄露或运行时读取问题。
- 这个方案可以接受于单用户、本地 MVP，但不能直接迁移到多人或公网生产环境。

更成熟的实现需要引入操作系统凭据存储、外部 Secret Manager，或至少使用独立主密钥完成静态加密和轮换。当前项目没有实现这些能力，因此文档必须把限制写在功能描述旁边。

<figure class="note-figure">
  <img
    src="/projects/mini-provider-gateway-portal/cover.png"
    alt="Mini Provider Gateway Portal 的本地管理仪表盘"
    width="1366"
    height="768"
    loading="lazy"
    decoding="async"
  />
  <figcaption>公开截图来自本地演示界面，不展示真实 Token、Provider Key、数据库内容或日志正文。</figcaption>
</figure>

## 日志为什么不保存 Provider 响应正文

调用日志的目标是回答“哪个 Consumer 在什么时候调用了哪个 Provider、是否成功、耗时和 Token 用量如何”，而不是保存对话本身。

当前日志记录的主要字段包括：

- request ID
- Consumer 与 Provider 引用
- 模型和路由
- 成功或失败状态
- HTTP 状态、耗时和 Token 统计
- 脱敏后的错误摘要

请求消息和正常响应正文不会写入日志。整理前，Adapter 在上游返回错误时会把 Provider 响应正文拼入异常消息，而代理层又会保存异常摘要。这可能把上游返回的调试信息带进本地调用日志。

本轮修正后，OpenAI-compatible 与 Ollama Adapter 只保留 HTTP 状态或网络错误，不再读取并拼接 Provider 错误响应正文。这样减少了错误页面、上游内部信息或意外回显内容进入日志的机会。

这不是完整的日志安全方案。生产环境仍需要字段白名单、日志访问控制、保留周期、删除策略和集中脱敏规则。

## 管理接口如何校验 Admin Token

Provider、Consumer 和日志路由都在路由级挂载 `adminAuth` 中间件。中间件读取 `x-admin-token`，缺失或与后端环境变量不一致时返回 `401`，通过后才进入具体管理操作。

```text
x-admin-token
  -> 是否存在
  -> 是否等于服务端 ADMIN_TOKEN
  -> 通过后访问管理路由
```

健康检查不需要 Admin Token；普通模型调用使用 Consumer Key。两条路径没有共用同一个凭据。

当前比较方式是直接字符串比较，没有账号体系、会话过期、权限角色、撤销列表或登录审计。因此它仍然是本地个人工具的最小管理边界。

## Admin Token 放在 localStorage 的限制

管理页面把 Admin Token 保存在浏览器 `localStorage`，刷新页面后可以继续调用管理 API。这对本地演示很方便，但有明确代价：

- 同一站点上下文中的脚本可以读取它。
- 如果前端出现 XSS，Token 可能被窃取。
- Token 没有自动过期和服务端会话撤销。
- 共用浏览器配置或设备时，不适合作为多人管理方案。

因此，项目不能把这个界面描述成完整认证系统。生产方案更适合使用安全 Cookie、短期会话、CSRF 防护、身份提供方和细粒度权限，而不是长期保存一个共享管理员 Token。

## 当前兼容范围

代理目前只实现基础、非流式的 Chat Completions 子集：

- `model`
- `messages`
- `temperature`
- `max_tokens`

OpenAI-compatible Adapter 会规范化 `/v1/chat/completions` 地址并强制 `stream: false`；Ollama Adapter 调用 `/api/chat`，再把结果转换为基础 OpenAI-compatible 响应结构。

当前没有实现：

- streaming
- tools 或 function calling
- embeddings
- Provider 自动重试或故障切换
- 完整 OpenAI API 兼容

Consumer 数据结构里虽然有 `rate_limit_per_min` 字段，但代码尚未执行限流。项目也没有计费、完整审计、多租户隔离或高可用。

## 本轮整理实际完成了什么

这次公开仓库整理没有增加网关功能，重点是让安全声明与代码一致：

- 明确 Consumer Key 只保存哈希，完整 Key 只在创建或轮换时返回一次。
- 明确 Provider Key 在本地 SQLite 中仍为明文，只通过管理 API 返回掩码。
- 修正两个 Provider Adapter，错误时不再把上游响应正文写入异常和日志。
- 修正 OpenAI-compatible Provider URL 拼接及对应测试。
- 补充 `.dockerignore`，排除本地配置、数据库、日志、依赖和构建产物。
- 调整 Docker 构建与静态前端托管路径。
- 校正文档中的接口范围、集成方式和非生产级边界。

验证阶段完成了：

- 根目录、后端和前端锁文件一致性检查
- 后端 `check`
- **10 项测试通过，0 项失败**
- 前端 Vite 构建
- 19 个后端源码文件的 JavaScript 语法检查
- 使用临时数据库和虚构本地 Provider 的隔离健康检查
- `docker compose config`
- Git diff 与暂存范围检查

测试覆盖不代表生产安全。已有测试主要验证 Consumer Key 哈希工具和 Provider URL 等基础行为，不能证明系统已经抵御现实攻击。

本机 Docker daemon 当时未运行，因此 `docker compose build` 没有完成，Docker 镜像仍缺少一次真实构建验证。检查没有使用真实 Provider Key，也没有调用收费 API。

## MVP 与生产级网关之间还缺什么

当前项目已经能说明 Gateway 的基本数据流和安全边界，但距离生产系统仍有明显差距：

1. Provider Key 的加密、轮换与 Secret Manager 集成。
2. 管理端真实身份认证、短期会话和权限模型。
3. 可执行的限流、配额和并发控制。
4. 计费、用量归属与更完整的审计事件。
5. 日志保留周期、访问控制和集中脱敏。
6. Provider 健康策略、重试、熔断和故障切换。
7. streaming、tools 等更完整的协议兼容。
8. 多实例部署、共享状态、迁移、备份和高可用。
9. 更全面的安全测试、依赖扫描和 CI 验证。

这些不是给 MVP 补几个字段就能完成的功能，而是涉及凭据生命周期、身份边界、运行可靠性和运维责任的系统设计。

## 下一步改进顺序

更合理的迭代顺序是先补安全基础，再扩大协议范围：

1. 为管理鉴权、Provider Key 掩码和错误日志脱敏增加回归测试。
2. 在可用 Docker 环境中完成镜像构建和容器健康检查。
3. 实现真正的请求限流，并让配置字段与行为一致。
4. 将 Provider Key 迁移到可轮换的加密或外部 Secret 存储。
5. 替换 localStorage Admin Token，建立可过期的管理会话。
6. 再评估重试、故障切换、streaming 和 tools 支持。
7. 最后再考虑计费、多租户、完整审计和高可用。

项目详情和源码可以从[项目作品页](/projects#mini-provider-gateway-portal)继续查看。
