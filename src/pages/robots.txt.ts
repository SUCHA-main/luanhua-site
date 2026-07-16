import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
