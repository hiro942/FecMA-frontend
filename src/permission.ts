import router from '@/router'
import useUserStore from '@/store/user'

const whiteList = [
  '/user/login',
  '/user/register',
  '/user/reset-password',
  '/top',
]

router.beforeEach((to, from) => {
  // 设置文档标题
  document.title = to?.meta?.title as string

  // 开发模式下无需登录
  // if (import.meta.env.DEV) {
  //   return true
  // }

  const { isLogin } = useUserStore()

  // 已登陆不能再进入白名单页面, 直接跳转至主页
  if (whiteList.includes(to.path) && isLogin) {
    return { name: 'Dashboard' }
  }

  // 未登陆状态不能进入白名单以外的页面, 重定向至登陆页
  if (!whiteList.includes(to.path) && !isLogin) {
    return { name: 'Login' }
  }

  return true
})
