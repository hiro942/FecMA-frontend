declare namespace UserAPI {
  // [Params]:用户信息
  type UserInfo = {
    id: string
    email: string
    nickname: string
    avatarUrl: string
    role: string
    createdAt: string
  }

  // [Params]:登录
  type LoginParams = {
    email: string
    password: string
  }

  // [Return]:登录
  type LoginResults = {
    token: string
  }

  // [Params]:注册
  type RegisterParams = {
    email: string
    captcha: string
    nickname: string
    password: string
    checkPassword: string
  }

  // [Params]:获取验证码
  type GetEmailCaptchaParams = {
    email: string
  }

  // [Params]:重置密码
  type ResetPasswordParams = {
    email: string
    captcha: string
    newPassword: string
    newCheckPassword: string
  }
}
