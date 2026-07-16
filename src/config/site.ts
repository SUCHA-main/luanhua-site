export const siteUrl = 'https://luanhua-site.vercel.app';

export const siteConfig = {
  siteName: '乱花 Personal Lab',
  siteUrl,
  description: '乱花的个人技术作品集，记录 AI 应用、全栈开发、实时通信与 DevOps 实验。',
  authorName: '乱花',
  githubUrl: 'https://github.com/SUCHA-main',
  repositoryUrl: 'https://github.com/SUCHA-main/luanhua-site',
  rssUrl: new URL('/rss.xml', siteUrl).toString(),
  sitemapUrl: new URL('/sitemap-index.xml', siteUrl).toString(),
} as const;
