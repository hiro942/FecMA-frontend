import request from '@/plugins/request'

const userApi = {
  GetUser: 'user/current',
  Login: '/auth/login',
  Logout: '/auth/logout',
  Register: '/auth/register',
  RegisterCaptcha: '/auth/register/code',
  ResetPassword: '/forget/password',
  ResetPasswordCaptcha: '/forget/password/code',
}

/* 获取当前用户信息 */
export async function getUser() {
  return request<UserAPI.UserInfo>({
    url: userApi.GetUser,
    method: 'GET',
  })
}

/* 登录 */
export async function login(data: UserAPI.LoginParams) {
  return request<UserAPI.UserInfo>({
    url: userApi.Login,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/* 退出登录 */
export async function logout() {
  return request<void>({
    url: userApi.Logout,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

/* 注册 */
export async function register(data: UserAPI.RegisterParams) {
  return request<void>({
    url: userApi.Register,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/* 注册时获取邮箱验证码 */
export async function getRegisterEmailCaptcha(
  data: UserAPI.GetEmailCaptchaParams,
) {
  return request<void>({
    url: userApi.RegisterCaptcha,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/* 重置密码 */
export async function resetPassword(data: UserAPI.ResetPasswordParams) {
  return request<void>({
    url: userApi.ResetPassword,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}

/* 重置密码时获取邮箱验证码 */
export async function getResetPasswordCaptcha(
  data: UserAPI.GetEmailCaptchaParams,
) {
  return request<API.BaseResponse<void>>({
    url: userApi.ResetPasswordCaptcha,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
  })
}
