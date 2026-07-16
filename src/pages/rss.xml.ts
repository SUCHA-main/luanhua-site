import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

export const GET: APIRoute = async ({ site }) => {
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );

  return rss({
    title: `${siteConfig.siteName} 技术笔记`,
    description: '真实项目复盘与技术笔记，记录实现路径、安全边界、验证结果和下一步计划。',
    site: site ?? new URL(siteConfig.siteUrl),
    items: notes.map((note) => ({
      title: note.data.title,
      description: note.data.description,
      pubDate: note.data.publishedAt,
      link: `/notes/${note.id}`,
      categories: [note.data.category, ...note.data.tags],
    })),
    customData: '<language>zh-CN</language>',
  });
};
