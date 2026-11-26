import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Relative paths: the built site works on GitHub Pages (/<repo>/) or any sub-folder.
  base: './',
})
