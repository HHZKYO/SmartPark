import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' : '/',
  plugins: [
    vue(),
    // 这里的名称要和主应用改造是配置项中的name保持一致
    qiankun('hmzs-big-screen', {
      useDevMode: true // 在开发模式下是否使用
    })
  ],
  server: {
    // 在主应用域名 //localhost:8081 下访问子应用时，子应用会被加载在 //localhost:8081 下运行！
    // 查找静态资源时会去主应用查找导致找不到，所以设置子应用服务使用资源的前缀域名子应用自己的
    // 防止开发阶段的 assets 静态资源加载问题
    origin: '//localhost:5173'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
