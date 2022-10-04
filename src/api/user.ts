import request from '@/plugins/request'

const userApi = {
  FetchCurrentUser: '/user/state',
  FetchMessages: '/user/messages',
  Login: '/auth/login',
  Logout: '/auth/logout',
  Register: '/auth/register',
  RegisterCaptcha: '/auth/register/code',
  ResetPassword: '/forget/password',
  ResetPasswordCaptcha: '/forget/password/code',
  ResetUserInfo: '/user/reset',
}

/* 获取当前用户信息 */
export async function fetchCurrentUser() {
  return request<UserModels.User>({
    url: userApi.FetchCurrentUser,
    method: 'GET',
  })
}

/* 获取用户消息列表 */
export async function fetchMessages() {
  return request<UserModels.Message[]>({
    url: userApi.FetchMessages,
    method: 'GET',
  })
}

/* 登录 */
export async function login(data: UserModels.LoginParams) {
  return request<UserModels.User>({
    url: userApi.Login,
    method: 'POST',
    data,
  })
}

/* 退出登录 */
export async function logout() {
  return request<void>({
    url: userApi.Logout,
    method: 'POST',
  })
}

/* 注册 */
export async function register(data: UserModels.RegisterParams) {
  return request<void>({
    url: userApi.Register,
    method: 'POST',
    data,
  })
}

/* 注册时获取邮箱验证码 */
export async function getRegisterEmailCaptcha(
  data: UserModels.GetEmailCaptchaParams
) {
  return request<void>({
    url: userApi.RegisterCaptcha,
    method: 'POST',
    data,
  })
}

/* 重置密码 */
export async function resetPassword(data: UserModels.ResetPasswordParams) {
  return request<void>({
    url: userApi.ResetPassword,
    method: 'POST',
    data,
  })
}

/* 重置密码时获取邮箱验证码 */
export async function getResetPasswordCaptcha(
  data: UserModels.GetEmailCaptchaParams
) {
  return request<void>({
    url: userApi.ResetPasswordCaptcha,
    method: 'POST',
    data,
  })
}

/* 重置用户信息 */
export async function resetUserInfo(data: UserModels.ResetUserInfo) {
  return request<void>({
    url: userApi.ResetUserInfo,
    method: 'POST',
    data,
  })
}
