import { EmailRegExp, NameRegExp, PasswordRegExp } from '@/constants'

// 登录表单校验
export const loginFormValidator = (formState: UserAPI.LoginParams) => {
  if (!EmailRegExp.test(formState.email)) {
    return Promise.reject(Error('邮箱格式不正确'))
  }
  if (!PasswordRegExp.test(formState.password)) {
    return Promise.reject(Error('密码只允许包含大小写字母和数字'))
  }
  if (formState.password.length < 6) {
    return Promise.reject(Error('密码长度至少6位'))
  }
  return Promise.resolve('校验通过')
}

// 注册表单校验
export const registerFormValidator = (formState: UserAPI.RegisterParams) => {
  if (!EmailRegExp.test(formState.email)) {
    return Promise.reject(Error('邮箱格式不正确'))
  }
  if (formState.captcha.length !== 6) {
    return Promise.reject(Error('请输入正确的验证码'))
  }
  if (!NameRegExp.test(formState.nickname)) {
    return Promise.reject(Error('昵称不可包含特殊字符'))
  }
  if (!PasswordRegExp.test(formState.password)) {
    return Promise.reject(Error('密码只允许包含大小写字母和数字'))
  }
  if (formState.password.length < 6) {
    return Promise.reject(Error('密码长度至少6位'))
  }
  if (formState.checkPassword !== formState.password) {
    return Promise.reject(Error('两次输入密码不一致'))
  }
  return Promise.resolve('校验通过')
}

// 重置密码表单校验
export const resetPasswordFormValidator = (formState: UserAPI.ResetPasswordParams) => {
  if (!EmailRegExp.test(formState.email)) {
    return Promise.reject(Error('邮箱格式不正确'))
  }
  if (formState.captcha.length !== 6) {
    return Promise.reject(Error('请输入正确的验证码'))
  }
  if (!PasswordRegExp.test(formState.newPassword)) {
    return Promise.reject(Error('密码只允许包含大小写字母和数字'))
  }
  if (formState.newPassword.length < 6) {
    return Promise.reject(Error('密码长度至少6位'))
  }
  if (formState.newCheckPassword !== formState.newPassword) {
    return Promise.reject(Error('两次输入密码不一致'))
  }
  return Promise.resolve('校验通过')
}

// 创建任务表单校验
export const taskAssignFormValidator = (formState: FLearningAPI.TaskAssignParams) => {
  try {
    Object.keys(formState).forEach((key) => {
      if (!formState[key as keyof FLearningAPI.TaskAssignParams]) {
        return new Error('请完整填写表单')
      }
      return true
    })
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err.message)
    }
  }

  if (!NameRegExp.test(formState.taskName)) {
    return Promise.reject(Error('任务名称不可包含特殊字符'))
  }
  return Promise.resolve('校验通过')
}
