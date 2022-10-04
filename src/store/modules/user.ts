import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {
  getLocal,
  LocalStorage,
  removeLocal,
  setLocal,
} from '@/utils/localStorage'
import { fetchCurrentUser, fetchMessages, login, logout } from '@/api/user'
import { DEFAULT_AVATAR } from '@/constants/global'

const useUserStore = defineStore('user', () => {
  const isLogin = ref<boolean>(!!getLocal(LocalStorage.LoginState))

  const userInfo = ref<UserModels.User>({
    email: '',
    nickname: 'Admin',
    avatarUrl: '',
    role: 'admin',
    partyID: '',
    org: '',
  })
  const getUserInfo = async () => {
    if (isLogin.value) {
      userInfo.value = await fetchCurrentUser()
    }
  }
  getUserInfo().catch((err) => console.error('[user store]', err))

  const doLogin = async (loginParams: UserModels.LoginParams) => {
    userInfo.value = await login(loginParams)
    userInfo.value.avatarUrl = userInfo.value.avatarUrl || DEFAULT_AVATAR
    setLocal(LocalStorage.LoginState, userInfo.value)
  }

  const doLogout = async () => {
    removeLocal(LocalStorage.LoginState)
    await logout() // 退出
    window.location.reload()
  }

  const messages = ref<UserModels.Message[]>([]) // 用户消息
  const updateMessages = async () => {
    messages.value = await fetchMessages()
  }
  updateMessages().catch((err) => console.error('[user store]', err))

  return {
    userInfo,
    isLogin,
    doLogin,
    doLogout,

    messages,
    updateMessages,
  }
})

export default useUserStore
