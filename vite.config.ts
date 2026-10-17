import { defineConfig } from 'vite';
import { site } from './src/content.ts';
import images from './src/images.json' with { type: 'json' };

// Preload the opening photograph straight from the HTML so it starts downloading before the JS runs.
const hero = (images as Record<string, { slug: string; w: number; h: number; widths: number[] }>)[site.hero.file];
const set = (ext: string) => hero.widths.map((w) => `/img/${hero.slug}-${w}.${ext} ${w}w`).join(', ');

export default defineConfig({
  plugins: [{
    name: 'hero-preload',
    transformIndexHtml: () => [{
      tag: 'link',
      attrs: {
        rel: 'preload', as: 'image', type: 'image/avif', fetchpriority: 'high',
        imagesrcset: set('avif'),
        imagesizes: `(max-width: 700px) 100vw, calc(86vh * ${(hero.w / hero.h).toFixed(3)})`,
      },
      injectTo: 'head',
    }],
  }],
});
