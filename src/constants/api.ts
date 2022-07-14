export const ServiceCode = {
  Success: 0, // 成功
  ParamError: 40000, // 请求参数错误
  NullError: 40001, // 请求数据为空
  NoLoginError: 40100, // 未登录
  AuthError: 40101, // 无权限
}

export const CallbackResult = {
  Pending: ['ASSIGNING', 'ACCEPTING', 'TRAINING'],
  Success: 'FINISHED',
  Error: 'ERROR',
}
