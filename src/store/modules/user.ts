import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getLocal,
  removeLocal,
  setLocal,
  useLocal,
} from '@/utils/useLocalStorage'
import { login, logout } from '@/api/user'
import { DEFAULT_AVATAR, LOCAL_LOGIN_STATE } from '@/constants'

const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserAPI.UserInfo>({
    email: '',
    nickname: '',
    avatarUrl: '',
    role: '',
    partyID: '',
    org: '',
  })

  const isLogin = ref<boolean>(!!getLocal(LOCAL_LOGIN_STATE))

  // TODO: 用户Token
  // const token = ref(getLocal('token') || '')
  // const setToken = (val: string) => {
  //   token.value = val
  //   setLocal('token', val)
  // }

  const doLogin = async (loginParams: UserAPI.LoginParams) => {
    userInfo.value = await login(loginParams)
    userInfo.value.avatarUrl = userInfo.value.avatarUrl || DEFAULT_AVATAR
    setLocal(LOCAL_LOGIN_STATE, true)
    // if (resToken) {
    //   setToken(resToken) // 设置token
    //   setLocal('token', resToken) // 本地保存token
    //   setLocal('login-form-state', loginParams) // 本地保存登录信息
    // }
  }

  const doLogout = async () => {
    removeLocal(LOCAL_LOGIN_STATE)
    await logout() // 退出
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
