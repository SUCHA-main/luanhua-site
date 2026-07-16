import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteUrl } from './src/config/site.ts';

export default defineConfig({
  site: siteUrl,
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/rss.xml') && !page.endsWith('/robots.txt'),
      namespaces: {
        news: false,
        xhtml: false,
        image: false,
        video: false,
      },
    }),
  ],
});
