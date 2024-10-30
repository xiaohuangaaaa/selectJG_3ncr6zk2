import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import byteluckCustomControlPlugin from '@byteluck-fe/vite-custom-control-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'process.env': {
      VUE_APP_BASE_PATH: '/',
    },
  },
  plugins: [vue(), byteluckCustomControlPlugin()],
}))
