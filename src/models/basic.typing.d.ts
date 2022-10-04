declare namespace BasicModels {
  // 后端通用返回结构
  type BasicResponse<T> = {
    code: number // 业务定义的状态码
    msg: string
    description: string
    data: T
  }
}
