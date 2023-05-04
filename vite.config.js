import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/vue-numbers-game/',
  plugins: [vue()],
  define: {
    __VUE_OPTIONS_API__: false
  }
})
