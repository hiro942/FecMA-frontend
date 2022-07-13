import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLocal, setLocal } from '@/utils/useLocalStorage'
import { login, logout } from '@/api/user'
import { getCookie } from '@/utils/useCookie'
import { DEFAULT_AVATAR } from '@/constants'

const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<UserAPI.UserInfo>({
    email: '2552450888@qq.com',
    nickname: '狗没拿塞',
    avatarUrl: '',
    role: 'user',
    partyID: '无',
    org: '这里是所属区块链组织名称',
  })

  // TODO: 暂时以是否有 session 这个 cookie 来判断是否登录
  const isLogin = ref(false)

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
    isLogin.value = true
    // if (resToken) {
    //   setToken(resToken) // 设置token
    //   setLocal('token', resToken) // 本地保存token
    //   setLocal('login-form-state', loginParams) // 本地保存登录信息
    // }
  }

  const doLogout = async () => {
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
