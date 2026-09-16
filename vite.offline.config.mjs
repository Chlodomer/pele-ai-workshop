import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync, readdirSync } from 'node:fs';
const assets = {};
for (const file of ['assets/high-ai-logo.jpg', 'assets/qualitative-interview.jpg', ...['collection','evidence','argument'].map(id => `assets/research-${id}.jpg`), ...readdirSync('public/downloads').map(f => 'downloads/' + f), ...readdirSync('public/videos').map(f => 'videos/' + f)]) {
  const mime = file.endsWith('.mp4') ? 'video/mp4' : file.endsWith('.jpg') ? 'image/jpeg' : file.endsWith('.pdf') ? 'application/pdf' : file.endsWith('.csv') ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8';
  assets[file] = `data:${mime};base64,${readFileSync('public/' + file).toString('base64')}`;
}
export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [react(), viteSingleFile()],
  define: { __OFFLINE_ASSETS__: JSON.stringify(assets) },
  build: { outDir: 'dist-offline', assetsInlineLimit: Infinity },
});
