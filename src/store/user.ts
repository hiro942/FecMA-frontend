import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCurrentUser, login, logout } from '@/api/user'

const useUserStore = defineStore('user', () => {
  const isLogin = ref<boolean>(!!localStorage.getItem('isLogin'))

  const currentUser = ref<UserModels.User>({
    email: '',
    nickname: 'Admin',
    avatarUrl: '',
    role: 'admin',
    partyID: '',
    org: '',
  })

  const doLogin = async (loginParams: UserModels.LoginParams) => {
    const loginUserInfo = await login(loginParams)
    console.log('loginUserInfo', loginUserInfo)
    localStorage.setItem('isLogin', loginUserInfo.email)
    window.location.reload()
  }

  const doLogout = async () => {
    localStorage.removeItem('isLogin')
    await logout() // 退出
    window.location.reload()
  }

  const getCurrentUser = async () => {
    if (isLogin.value) {
      currentUser.value = await fetchCurrentUser()
    }
  }
  getCurrentUser().catch((err) => console.error('[user store]', err))

  return {
    isLogin,
    currentUser,
    doLogin,
    doLogout,
  }
})

export default useUserStore
