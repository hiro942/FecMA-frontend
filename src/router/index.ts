import { createRouter, createWebHistory } from 'vue-router'
import { constantRouterMap } from '@/config/router.config'

const router = createRouter({
  history: createWebHistory(''), // 路由模式
  routes: constantRouterMap, // 路由
})

export default router
