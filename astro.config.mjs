import { defineConfig } from 'astro/config';

export default defineConfig({
  // Trocar quando houver domínio próprio.
  site: 'https://aline-tattoo.vercel.app',
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
