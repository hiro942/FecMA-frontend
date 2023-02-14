import request from '@/plugins/request'

const userApi = {
  FetchCurrentUser: '/user/state',
  Login: '/auth/login',
  Logout: '/auth/logout',
  Register: '/auth/register',
  RegisterCaptcha: '/auth/register/code',
  ResetPassword: '/forget/password',
  ResetPasswordCaptcha: '/forget/password/code',
  ResetUserInfo: '/user/reset',
}

// TODO: 后端关于上述的接口仅接收 form-data 格式传参
const headers = { 'Content-Type': 'multipart/form-data' }

/* 获取当前用户信息 */
export async function fetchCurrentUser() {
  return request<UserModels.User>({
    url: userApi.FetchCurrentUser,
    method: 'GET',
  })
}

/* 登录 */
export async function login(data: UserModels.LoginParams) {
  return request<UserModels.User>({
    url: userApi.Login,
    method: 'POST',
    data,
    headers,
  })
}

/* 退出登录 */
export async function logout() {
  return request({
    url: userApi.Logout,
    method: 'POST',
  })
}

/* 注册 */
export async function register(data: UserModels.RegisterParams) {
  return request({
    url: userApi.Register,
    method: 'POST',
    data,
    headers,
  })
}

/* 注册时获取邮箱验证码 */
export async function getRegisterEmailCaptcha(data: { email: string }) {
  return request({
    url: userApi.RegisterCaptcha,
    method: 'POST',
    data,
    headers,
  })
}

/* 重置密码 */
export async function resetPassword(data: UserModels.ResetPasswordParams) {
  return request({
    url: userApi.ResetPassword,
    method: 'POST',
    data,
    headers,
  })
}

/* 重置密码时获取邮箱验证码 */
export async function getResetPasswordCaptcha(data: { email: string }) {
  return request({
    url: userApi.ResetPasswordCaptcha,
    method: 'POST',
    data,
    headers,
  })
}

/* 重置用户信息 */
export async function resetUserInfo(data: UserModels.ResetUserInfo) {
  return request({
    url: userApi.ResetUserInfo,
    method: 'POST',
    data,
    headers,
  })
}
