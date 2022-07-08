import NProgress from 'nprogress'
import router from '@/router'
import useUserStore from '@/store/modules/user'
import { useLocal } from '@/utils/useLocalStorage'
import 'nprogress/nprogress.css'

const loginPath = '/user/login'
const whiteList = ['/user/login', '/user/register', '/user/reset-password']

router.beforeEach(async (to, from) => {
  NProgress.start()

  // 设置文档标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const userStore = useUserStore()

  // 已登陆不能再进入白名单页面, 直接跳转至主页
  if (whiteList.includes(to.path)) {
    if (userStore.isLogin) {
      router.push('/')
    }
    return
  }

  // // 未登陆状态不能进入白名单以外的页面, 重定向至登陆页
  if (!userStore.isLogin) {
    router.push({ name: 'Login' })
  }

  // // 已登陆用户的token是否失效
  // useLocal('token').catch(() => userStore.doLogout())
})

router.afterEach(() => {
  NProgress.done()
})
