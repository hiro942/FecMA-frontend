declare namespace UserModels {
  // 用户信息
  type User = {
    email: string
    nickname: string
    partyID: string // fate节点ID
    org: string // 组织名称
    avatarUrl: string
    role: string
  }

  // 消息
  type Message = {
    time: string
    content: string
  }

  // [Params]:登录
  type LoginParams = {
    email: string
    password: string
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

  // [Params]:重置用户信息
  type ResetUserInfo = {
    newVal: string
  }
}
