import axios, { AxiosRequestConfig } from 'axios'
import useUserStore from '@/store/user'
import useStyleStore from '@/store/style'
import router from '@/router'

// 与后端约定好的响应业务码
const ServiceCode = {
  Success: 0, // 成功
  ParamError: 40000, // 请求参数错误
  NullError: 40001, // 请求数据为空
  ServerError: 40002, // 服务器错误无法返回正确数据
  NoLoginError: 40100, // 未登录
  AuthError: 40101, // 无权限
}

// 创建axios服务实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: '/api',
  timeout: 60 * 1000, // request timeout 60s
  withCredentials: true, // 跨域请求携带cookie等凭证信息
})

// 全局请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log('[request success]', config.url)
    // TODO, 用户相关的接口全部是 json 传参，其余接口都是 form
    if (config.url?.includes('auth') || config.url?.includes('user')) {
      // @ts-ignore
      config.headers['Content-Type'] = 'application/json'
    } else {
      // @ts-ignore
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    useStyleStore().showLoading = true
    return config
  },
  (error) => {
    useStyleStore().showLoading = false
    console.log('[request error]', error)
    return Promise.reject(error)
  }
)

// 全局响应拦截器
service.interceptors.response.use(
  // 处理响应，交出实际数据
  (response) => {
    useStyleStore().showLoading = false
    const { code, data, msg, description } = response.data
    // TODO: 当下载内容时候，没有code字段，直接将文件内容返回
    if (code === undefined) {
      console.log('@@@')
      return response
    }
    // 成功
    if (code === ServiceCode.Success) {
      return response.data
    }
    // 未登录
    if (code === ServiceCode.NoLoginError) {
      useUserStore().doLogout()
      return Promise.reject(
        new Error(description || '未登录或登录信息过期，请重新登录')
      )
    }
    // 服务器错误
    if (code === ServiceCode.ServerError) {
      return Promise.reject(new Error(description || '服务器错误'))
    }
    return response.data
  },
  (error) => {
    useStyleStore().showLoading = false
    const { status } = error.response
    if (status === 401) {
      return Promise.reject(new Error('无权限'))
    }
    if (status === 403) {
      return Promise.reject(new Error('禁止访问'))
    }
    if (status === 404) {
      return Promise.reject(new Error('找不到资源'))
    }
    if (error.response?.status === 500) {
      return Promise.reject(new Error('服务器出错'))
    }
    return Promise.reject(error)
  }
)

// 封装通用axios请求函数
async function request<T>(config: AxiosRequestConfig) {
  return service.request<T>(config).then((responseData) => responseData.data)
}

export default request
