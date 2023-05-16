import { createRouter, createWebHistory } from 'vue-router'
import { exceptionRoutes, mainRoutes, userRoutes } from '@/configs/routes'

const router = createRouter({
  history: createWebHistory(''), // 路由模式
  routes: [...mainRoutes, ...userRoutes, ...exceptionRoutes], // 路由
})

export default router
