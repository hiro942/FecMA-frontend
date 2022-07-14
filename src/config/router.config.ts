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
    path: '/',
    name: 'Index',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/user/Admin.vue'),
        meta: { title: '管理页', permission: ['admin'] },
      },
      {
        path: 'person',
        name: 'Person',
        component: () => import('@/views/user/Person.vue'),
        meta: { title: '个人中心' },
      },
      {
        path: 'message',
        name: 'Message',
        component: () => import('@/views/user/MessageList.vue'),
        meta: { title: '消息中心' },
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
            path: 'all-task',
            name: 'AllTask',
            component: () => import('@/views/fLearning/AllTask.vue'),
            meta: { title: '任务列表' },
          },
        ],
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

export const asyncRouterMap = []
