import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLocal, setLocal } from '@/utils/useLocalStorage'
import { login, logout } from '@/api/user'

const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserAPI.UserInfo>({
    id: '',
    email: '',
    nickname: '',
    avatarUrl: '',
    role: '',
    createdAt: '',
  })
  const setUserInfo = (val: UserAPI.UserInfo) => {
    userInfo.value = val
  }

  // 用户Token
  const token = ref(getLocal('token') || '')
  const setToken = (val: string) => {
    token.value = val
    setLocal('token', val)
  }

  // 用户登陆, 设置token
  const doLogin = async (loginParams: UserAPI.LoginParams) => {
    const resToken = (await login(loginParams)).token
    if (resToken) {
      setToken(resToken) // 设置token
      setLocal('token', resToken) // 本地保存token
      setLocal('login-form-state', loginParams) // 本地保存登录信息
    }
  }

  const doLogout = async () => {
    await logout() // 退出
    setToken('') // 清空token
  }

  return {
    userInfo,
    setUserInfo,

    token,
    setToken,

    doLogin,
    doLogout,
  }
})

export default useUserStore
