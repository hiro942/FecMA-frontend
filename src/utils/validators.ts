// 邮箱格式

import { type } from 'os'

export const EmailRegExp = /^[a-zA-z\d._-]+@[a-zA-z\d]+.[a-zA-z\d]+/

// 密码为字母（大小写均可）和数字的组合
export const PasswordRegExp = /[a-zA-z\d]+/

// 昵称/名称为任意表意文字
export const NameRegExp = /[\p{Unified_Ideograph}a-zA-Z\d]+/u

// 判空逻辑
const isAnyBlank = (obj: any): boolean => {
  // eslint-disable-next-line no-restricted-syntax
  for (const k in obj) {
    if (typeof obj[k] === 'string' && !obj[k].trim()) {
      return false
    }
  }
  return true
}

// 登录表单校验
export const loginFormValidator = (formState: UserModels.LoginParams) => {
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
export const registerFormValidator = (formState: UserModels.RegisterParams) => {
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
export const resetPasswordFormValidator = (
  formState: UserModels.ResetPasswordParams
) => {
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

export const taskAssignFormValidators = {
  commonSettingsValidator: (
    formState: FLearningModels.TaskAssign.CommonSettings
  ): Promise<string> => {
    if (!isAnyBlank(formState)) {
      return Promise.reject(Error('基本信息未填写完整'))
    }
    if (!NameRegExp.test(formState.taskName)) {
      return Promise.reject(Error('任务名称包含特殊字符'))
    }
    return Promise.resolve('ok')
  },

  algorithmSettingsValidator: (
    formState: FLearningModels.TaskAssign.AlgorithmSettings
  ) => {
    if (!isAnyBlank(formState)) {
      return Promise.reject(Error('算法模型设置未填写完整'))
    }
    return Promise.resolve('ok')
  },

  // secureBoostSettingsValidator: (
  //   formState: FLearningAPI.task-assign.SecureBoostSettings
  // ): Promise<string> => {
  //   if (!isAnyBlank(formState)) {
  //     return Promise.reject(Error('算法模型设置未填写完整'))
  //   }
  //   return Promise.resolve('ok')
  // },
  // neuralNetworkSettingsValidator: () => {},
  // logisticRegressionSettingsValidator: () => {},
}
