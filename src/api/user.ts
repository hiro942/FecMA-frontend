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

/* 获取当前用户信息 */
export async function fetchCurrentUser() {
  return request<UserAPI.UserInfo>({
    url: userApi.FetchCurrentUser,
    method: 'GET',
  })
}

/* 登录 */
export async function login(data: UserAPI.LoginParams) {
  return request<UserAPI.UserInfo>({
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
export async function register(data: UserAPI.RegisterParams) {
  return request<void>({
    url: userApi.Register,
    method: 'POST',
    data,
  })
}

/* 注册时获取邮箱验证码 */
export async function getRegisterEmailCaptcha(
  data: UserAPI.GetEmailCaptchaParams
) {
  return request<void>({
    url: userApi.RegisterCaptcha,
    method: 'POST',
    data,
  })
}

/* 重置密码 */
export async function resetPassword(data: UserAPI.ResetPasswordParams) {
  return request<void>({
    url: userApi.ResetPassword,
    method: 'POST',
    data,
  })
}

/* 重置密码时获取邮箱验证码 */
export async function getResetPasswordCaptcha(
  data: UserAPI.GetEmailCaptchaParams
) {
  return request<void>({
    url: userApi.ResetPasswordCaptcha,
    method: 'POST',
    data,
  })
}

/* 重置用户信息 */
export async function resetUserInfo(data: UserAPI.ResetUserInfo) {
  return request<void>({
    url: userApi.ResetUserInfo,
    method: 'POST',
    data,
  })
}
