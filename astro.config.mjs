// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

/**
 * Configuración de Astro para CIBA.
 * - output: 'hybrid' → páginas estáticas por defecto, SSR solo donde se marca
 *   con `export const prerender = false` (necesario para /api/contact y auth).
 * - El adapter de Vercel se encarga del runtime serverless en despliegue.
 */
export default defineConfig({
  site: 'https://ciba.vercel.app',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: false },
    imageService: true,
    maxDuration: 10
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/admin') &&
        !page.includes('/api/') &&
        !page.includes('/404')
    })
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true
    }
  },
  vite: {
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  }
});
