import BasicLayout from '@/layouts/BasicLayout/Index.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
import {
  Albums,
  Apps,
  Create,
  CubeOutline,
  GlobeSharp,
  Home,
  SearchCircle,
  Skull,
} from '@vicons/ionicons5'

export const userRoutes = [
  {
    path: '/user',
    name: 'User',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login.vue'),
        meta: { title: '登录' },
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/user/Register.vue'),
        meta: { title: '注册' },
      },
    ],
  },
]

export const exceptionRoutes = [
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404.vue'),
    meta: { title: '迷路了*.*' },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500.vue'),
    meta: { title: '出错了*.*' },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403.vue'),
    meta: { title: '没权限*.*' },
  },
  {
    // 其他未知路由
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]

export const menuRoutes = [
  {
    path: 'space',
    name: 'Space',
    component: () => import('@/views/user/Space.vue'),
    meta: { title: '个人中心', hideInMenu: true },
  },
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/Index.vue'),
    meta: { title: 'Dashboard', keepAlive: true, icon: Home },
  },
  {
    path: 'task',
    name: 'Task',
    component: BlankLayout,
    redirect: '/task/list',
    meta: { hideInMenu: true },
  },
  {
    path: '/task/list',
    name: 'MyTask',
    component: () => import('@/views/task-list/MyTask.vue'),
    meta: { title: '我的任务', keepAlive: true, icon: Albums },
  },
  {
    path: '/task/assign',
    name: 'TaskAssign',
    component: () => import('@/views/task-assign/Index.vue'),
    meta: { title: '创建任务', keepAlive: true, icon: Create },
  },
  {
    path: '/task/explore',
    name: 'TaskExplore',
    component: () => import('@/views/task-list/AllTask.vue'),
    meta: { title: '搜索任务', keepAlive: true, icon: SearchCircle },
  },
  {
    path: 'model',
    name: 'Model',
    component: () => import('@/views/inference/ModelList.vue'),
    meta: { title: '模型推理', keepAlive: true, icon: Skull },
  },
  {
    path: 'blockchain',
    name: 'BlockChain',
    component: () => import('@/views/blockchain/BlockList.vue'),
    meta: { title: '区块链信息', keepAlive: true, icon: GlobeSharp },
  },
  {
    path: 'application',
    name: 'Application',
    children: [
      {
        path: 'ipv6',
        name: 'IPv6',
        component: () => import('@/views/application/IPv6.vue'),
        meta: { title: 'IPv6地址推断', keepAlive: true, icon: CubeOutline },
      },
    ],
    meta: { title: '应用', keepAlive: true, icon: Apps },
  },
]

export const mainRoutes = [
  {
    path: '/top',
    name: 'Top',
    component: () => import('@/views/top/Top.vue'),
    meta: { title: 'Main Gate' },
  },
  {
    path: '/',
    name: 'Home',
    component: BasicLayout,
    redirect: '/top',
    children: menuRoutes,
  },
]
