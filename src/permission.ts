import NProgress from 'nprogress'
import router from '@/router'
import useUserStore from '@/store/modules/user'
import { useLocal } from '@/utils/useLocalStorage'
import 'nprogress/nprogress.css'

const loginPath = '/user/login'
const whiteList = ['/user/login', '/user/register', '/user/reset-password']

router.beforeEach(async (to) => {
  NProgress.start()

  // 设置文档标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // const userStore = useUserStore()

  // // 已登陆不再进入白名单页面
  // if (whiteList.includes(to.path)) {
  //   if (userStore.token) {
  //     return from.path
  //   }
  // }

  // // 未登陆不能白名单以外的页面, 重定向至登陆页
  // if (!userStore.token) {
  //   return `${loginPath}from=${to.fullPath}`
  // }

  // // 已登陆用户的token是否失效
  // useLocal('token').catch(() => userStore.doLogout())
})

router.afterEach(() => {
  NProgress.done()
})
