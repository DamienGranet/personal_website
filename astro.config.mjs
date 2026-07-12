import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Site URL is used for the sitemap, canonical URLs and Open Graph tags.
// If the domain ever changes, update it here AND in src/data/profile.json (meta.siteUrl).
export default defineConfig({
  site: 'https://damiengranet.com',
  integrations: [
    sitemap({
      // The editor is a private utility page; keep it out of search engines.
      filter: (page) => !page.includes('/edit'),
    }),
  ],
  build: {
    format: 'directory',
  },
});
