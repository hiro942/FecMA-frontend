import BasicLayout from '@/layouts/BasicLayout/BasicLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

export const constantRouterMap = [
  {
    path: '/user',
    name: 'User',
    component: UserLayout,
    redirect: '/user/login',
    children: [
      {
        path: 'space',
        name: 'Space',
        component: () => import('@/views/user/Space.vue'),
        meta: { title: '个人中心' },
      },

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
      {
        path: 'reset-password',
        name: 'ResetPassword',
        component: () => import('@/views/user/ResetPassword.vue'),
        meta: { title: '重置密码' },
      },
    ],
  },
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/user/MessageList.vue'),
        meta: { title: '消息中心', keepAlive: true },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: 'Dashboard', keepAlive: true },
      },
      {
        path: 'task',
        name: 'Task',
        component: BlankLayout,
        redirect: '/task/assign',
        children: [
          {
            path: 'list',
            name: 'MyTask',
            component: () => import('@/views/task-list/MyTask.vue'),
            meta: { title: '我的任务', keepAlive: true },
          },
          {
            path: 'assign',
            name: 'TaskAssign',
            component: () => import('@/views/task-assign/TaskAssign.vue'),
            meta: { title: '创建任务', keepAlive: true },
          },
          {
            path: 'explore',
            name: 'TaskExplore',
            component: () => import('@/views/task-list/AllTask.vue'),
            meta: { title: '搜索任务', keepAlive: true },
          },
          {
            path: 'detail',
            name: 'TaskDetail',
            component: () =>
              import('@/views/task-list/components/TaskDetailModal.vue'),
            meta: { title: '任务详情', keepAlive: true },
          },
        ],
      },
      {
        path: 'model',
        name: 'Model',
        component: () => import('@/views/inference/ModelList.vue'),
        meta: { title: '模型推理', keepAlive: true },
      },
      {
        path: 'blockchain',
        name: 'BlockChain',
        component: () => import('@/views/blockchain/BlockList.vue'),
        meta: { title: '区块链信息', keepAlive: true },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404.vue'),
    meta: { title: '迷路了*.*' },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403.vue'),
    meta: { title: '没权限*.*' },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]
