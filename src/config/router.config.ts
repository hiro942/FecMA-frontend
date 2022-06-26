import BasicLayout from '@/layouts/BasicLayout.vue'
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
        path: 'login',
        name: 'Login',
        component: () => import('@/views/user/Login.vue'),
        meta: { title: '登陆' },
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
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
        meta: { title: '管理页', permission: ['admin'] },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'federate-learning',
        name: 'FederateLearning',
        component: BlankLayout,
        redirect: '/federate-learning/task-assign',
        children: [
          {
            path: 'task-assign',
            name: 'TaskAssign',
            component: () => import('@/views/fLearning/TaskAssign.vue'),
            meta: { title: '创建任务' },
          },
          {
            path: 'my-task',
            name: 'MyTask',
            component: () => import('@/views/fLearning/MyTask.vue'),
            meta: { title: '我的任务' },
          },
          {
            path: 'task-list',
            name: 'TaskList',
            component: () => import('@/views/fLearning/AllTask.vue'),
            meta: { title: '任务列表' },
          },
        ],
      },
    ],
  },
]

export const asyncRouterMap = [

]
