declare namespace API {
  // 后端通用返回结构
  type BaseResponse<T> = {
    code: number // 业务定义的状态码
    msg: string
    description: string
    data: T
  }
}
