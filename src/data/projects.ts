export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  shortTitle?: string;
  heroSummary?: string;
  type: string;
  subtitle: string;
  description: string;
  highlights: string[];
  tags: string[];
  status: string;
  github?: string;
  demo?: string;
  image?: ProjectImage;
  featured: boolean;
  order: number;
  limitations: string[];
}

export const projects: PortfolioProject[] = [
  {
    id: 'ai-wechat-digest-mvp',
    title: 'AI WeChat Digest MVP',
    shortTitle: 'AI Digest',
    heroSummary: 'RSS · Mock-first',
    type: 'AI 应用 / 信息整理',
    subtitle: '把 RSS、SQLite、Mock-first AI 摘要和晚报输出串成一条安全可演示的流程',
    description:
      '一个面向个人信息整理的 RSS + AI 摘要 MVP。默认使用 Mock 模式，也支持配置 DeepSeek / OpenAI-compatible 与 Ollama；项目没有实现微信公众号抓取或公众号发布。',
    highlights: ['RSS + Mock-first 摘要', 'SQLite 去重与偏好评分', 'Markdown 晚报与可选推送出口'],
    tags: ['Node.js', 'Express', 'SQLite', 'RSS', 'Ollama'],
    status: 'Public MVP',
    github: 'https://github.com/SUCHA-main/ai-wechat-digest-mvp',
    image: {
      src: '/projects/ai-wechat-digest-mvp/cover.png',
      alt: 'AI WeChat Digest MVP 的 RSS 数据源管理界面',
      width: 1440,
      height: 1100,
    },
    featured: true,
    order: 1,
    limitations: ['默认 AI 模式为 Mock', '未实现微信公众号抓取或公众号发布', '真实配置和运行数据库仅保留在本地'],
  },
  {
    id: 'mini-provider-gateway-portal',
    title: 'Mini Provider Gateway Portal',
    shortTitle: 'Gateway',
    heroSummary: 'Providers · Keys · Logs',
    type: 'AI 基础设施 / 全栈 MVP',
    subtitle: '管理 Ollama 与 OpenAI-compatible Provider、Consumer Key 和调用元数据的个人网关',
    description:
      '一个用于本地学习和个人使用的 AI Provider Gateway MVP，提供 Provider 管理、Consumer Key 生命周期和基础非流式 Chat Completions 代理，不是生产级 API 网关。',
    highlights: ['Provider 与 Consumer 管理', '基础 Chat Completions 代理', '脱敏调用元数据日志'],
    tags: ['React', 'Express', 'SQLite', 'Ollama', 'Docker'],
    status: 'Public MVP',
    github: 'https://github.com/SUCHA-main/mini-provider-gateway-portal',
    image: {
      src: '/projects/mini-provider-gateway-portal/cover.png',
      alt: 'Mini Provider Gateway Portal 的本地管理仪表盘',
      width: 1366,
      height: 768,
    },
    featured: true,
    order: 2,
    limitations: ['Provider Key 当前在本地 SQLite 中明文存储', '仅支持基础非流式接口子集', '不包含生产级认证、限流、计费或高可用'],
  },
  {
    id: 'go-websocket-chatroom',
    title: 'Go WebSocket Chatroom',
    shortTitle: 'Chatroom',
    type: 'Go 后端 / 实时通信',
    subtitle: '围绕登录会话、消息广播、历史消息和可选 Ollama 助手构建的实时聊天室',
    description:
      '一个 Go WebSocket 学习项目，覆盖注册登录、会话状态、实时广播、在线人数、emoji 与本地表情，并可在本地配置 Ollama AI 助手。',
    highlights: ['WebSocket 实时广播', '登录会话与历史消息', '可选本地 Ollama 助手'],
    tags: ['Go', 'WebSocket', 'Ollama', 'HTML', 'CSS'],
    status: 'Open Source',
    github: 'https://github.com/SUCHA-main/go-websocket-chatroom',
    image: {
      src: '/projects/go-websocket-chatroom/cover.png',
      alt: 'Go WebSocket Chatroom 的实时聊天界面',
      width: 1440,
      height: 983,
    },
    featured: true,
    order: 3,
    limitations: ['定位为学习与本地演示项目', '没有公开在线 Demo', '不宣称生产级认证或消息可靠性'],
  },
  {
    id: 'labelhub-ai-mvp',
    title: 'LabelHub AI MVP',
    shortTitle: 'LabelHub',
    type: '全栈 MVP / 数据标注',
    subtitle: '用动态表单、角色工作流和规则驱动 Mock AI Review 演示标注审核闭环',
    description:
      '一个 React + Vite 前端、Express 后端和 JSON 文件持久化组成的全栈 MVP。AI 预审由规则驱动的 Mock 实现，演示角色登录不是真实认证系统。',
    highlights: ['动态 Schema 标注表单', '规则驱动 Mock AI Review', 'Demo 角色工作流与 Docker 演示'],
    tags: ['React', 'Vite', 'Express', 'JSON', 'Docker'],
    status: 'Public MVP',
    github: 'https://github.com/SUCHA-main/labelhub-ai-mvp',
    image: {
      src: '/projects/labelhub-ai-mvp/cover.png',
      alt: 'LabelHub AI MVP 的管理员任务工作台',
      width: 2020,
      height: 1755,
    },
    featured: true,
    order: 4,
    limitations: ['AI Review 是规则驱动 Mock', 'Demo 登录不是真实认证', 'JSON 文件持久化只适合本地演示'],
  },
  {
    id: 'sign-language-demo',
    title: 'Sign Language Demo',
    type: '计算机视觉 / 手势识别',
    subtitle: '从本地采集、关键点归一化、RandomForest 训练到实时预测的五类手势 MVP',
    description:
      '一个基于 MediaPipe、OpenCV 和 scikit-learn 的五类自定义手势识别工程实践，标签用于本地演示，不是标准手语词汇或通用手语翻译系统。',
    highlights: ['MediaPipe 21 点关键点', '自定义采集与 RandomForest', '实时预测与结果平滑'],
    tags: ['Python', 'MediaPipe', 'OpenCV', 'scikit-learn'],
    status: 'Open Source',
    github: 'https://github.com/SUCHA-main/sign-language-demo',
    featured: false,
    order: 5,
    limitations: ['只识别五类自定义手势', '模型和个人采集数据不进入公开仓库', '历史本地准确率不是正式评测结果'],
  },
  {
    id: 'fooocus-zh-local-patch',
    title: 'Fooocus 中文本地 UI 补丁',
    type: 'AI 工具优化 / 本地化',
    subtitle: '面向中文本地使用场景的非官方 Fooocus UI、预设和启动体验补丁',
    description:
      '一个低侵入、可回滚的 Fooocus 本地补丁项目，整理中文界面、常用预设、Styles 简化、本地启动方式和维护说明。',
    highlights: ['中文 UI 与常用预设', '本地启动体验优化', '低侵入与回滚说明'],
    tags: ['Fooocus', 'SDXL', 'JavaScript', 'UI Patch'],
    status: 'Open Source',
    github: 'https://github.com/SUCHA-main/fooocus-zh-local-patch',
    featured: false,
    order: 6,
    limitations: ['非官方 Fooocus 补丁', '依赖本地 Fooocus 环境与模型', '仓库不包含模型文件'],
  },
  {
    id: 'cicd-lab',
    title: 'CI/CD Lab',
    type: 'DevOps 实验 / 本地环境',
    subtitle: '在本地串联代码托管、构建、镜像仓库、部署与基础监控的实验记录',
    description:
      '一个用于理解 DevOps 流程的本地实验环境，涉及 Jenkins、Gitea、Harbor、Docker 和 Zabbix，并通过小型服务验证从提交到部署与监控的链路。',
    highlights: ['Jenkins 构建流程', 'Gitea + Harbor 本地链路', 'Zabbix 可用性监控'],
    tags: ['Jenkins', 'Gitea', 'Harbor', 'Docker', 'Zabbix'],
    status: 'Local Lab',
    featured: false,
    order: 7,
    limitations: ['当前没有独立公开仓库', '依赖本地基础设施', '不作为可直接复用的生产部署方案'],
  },
  {
    id: 'luanhua-site',
    title: '乱花 luanhua-site',
    type: '个人网站 / 作品集入口',
    subtitle: '使用 Astro 和原生 CSS 整理项目、技术方向与阶段性记录',
    description:
      '当前这个持续迭代的个人站点，用统一项目数据连接首页、项目页和关于页，并作为作品与复盘的导航入口。',
    highlights: ['Astro 静态站点', 'TypeScript 项目数据', '响应式与轻量交互'],
    tags: ['Astro', 'TypeScript', 'CSS', 'Vercel'],
    status: 'In Progress',
    github: 'https://github.com/SUCHA-main/luanhua-site',
    demo: '/',
    featured: false,
    order: 8,
    limitations: ['站点内容仍持续更新', '技术笔记尚未全部整理为正式文章'],
  },
];

export const orderedProjects = [...projects].sort((a, b) => a.order - b.order);
export const featuredProjects = orderedProjects.filter((project) => project.featured);
export const otherProjects = orderedProjects.filter((project) => !project.featured);
export const representativeProjects = featuredProjects.slice(0, 3);
