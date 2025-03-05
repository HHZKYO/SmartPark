import { createRouter, createWebHistory } from 'vue-router'
import BigScreen from '../views/big-screen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // 路由模式
  routes: [
    {
      path: '/', // 默认路由路径（网页直接打开时访问的路由地址）url上路径地址
      redirect: '/big-screen' // 跳转到指定的路由地址
    },
    {
      path: '/big-screen',
      name: 'big-screen',
      component: BigScreen
    }
  ]
})

export default router
