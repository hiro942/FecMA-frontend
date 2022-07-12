import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLocal, setLocal } from '@/utils/useLocalStorage'
import { login, logout } from '@/api/user'
import { getCookie } from '@/utils/useCookie'
import { DEFAULT_AVATAR } from '@/constants'

const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserAPI.UserInfo>({
    email: '无',
    nickname: '无',
    avatarUrl: '',
    role: 'user',
    partyID: '无',
    org: '这里是所属区块链组织名称',
  })

  // TODO: 暂时以是否有 session 这个 cookie 来判断是否登录
  const isLogin = ref(getCookie('session') !== '')

  // TODO: 用户Token
  // const token = ref(getLocal('token') || '')
  // const setToken = (val: string) => {
  //   token.value = val
  //   setLocal('token', val)
  // }

  // 用户登陆, 设置token
  const doLogin = async (loginParams: UserAPI.LoginParams) => {
    userInfo.value = await login(loginParams)
    userInfo.value.avatarUrl = userInfo.value.avatarUrl || DEFAULT_AVATAR

    // if (resToken) {
    //   setToken(resToken) // 设置token
    //   setLocal('token', resToken) // 本地保存token
    //   setLocal('login-form-state', loginParams) // 本地保存登录信息
    // }
  }

  const doLogout = async () => {
    // TODO: 没有logout接口啊，这里先前端删除所有cookie当作退出登录
    // await logout() // 退出
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' // 清除登录态 session
    // setToken('') // 清空token
    window.location.reload()
  }

  return {
    userInfo,

    isLogin,
    // token,
    // setToken,

    doLogin,
    doLogout,
  }
})

export default useUserStore
