import axios, { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { responseDataFormatter, timeFormatter } from '@/utils/formatters'
import useUserStore from '@/store/modules/user'
import { ServiceCode } from '@/constants/api'
import useStyleStore from '@/store/modules/style'

// 生产服务器地址 -> http://10.99.12.103:88/api
// 局域网测试地址 -> http://10.128.252.195:88/api
// Apifox -> http://127.0.0.1:4523/m1/1118652-0-default
// baseURL: import.meta.env.DEV ? 'http://127.0.0.1:4523/m1/1118652-0-default' : 'http://10.99.12.103:88/api'

// 创建axios服务实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: import.meta.env.DEV
    ? 'http://127.0.0.1:4523/m1/1118652-0-default'
    : 'http://10.99.12.103:88/api', // url = base url + request url
  timeout: 300 * 1000, // request timeout 10s
  withCredentials: true, // 跨域请求携带cookie等凭证信息
})

// 响应异常拦截处理
const errorHandler = (error: any) => {
  useStyleStore().showLoading = false
  console.error('[error handler]', error)
  if (error.response) {
    const { status } = error.response
    if (status === 401) {
      ElNotification.error('UnAuthorized')
    }
    if (status === 403) {
      ElNotification.error('Forbidden')
    }
  }
  return Promise.reject(error)
}

// 全局请求拦截器
service.interceptors.request.use(
  (config) => {
    useStyleStore().showLoading = true
    return config
  },
  (error) => {
    useStyleStore().showLoading = false
    console.log('[interceptors.request]: request error', error) // for debug
    return Promise.reject(error)
  }
)

// 全局响应拦截器
service.interceptors.response.use(
  // 处理响应，交出实际数据
  (response) => {
    console.warn(response.config.url)
    console.log(response.data)

    const { code, data, msg, description } = response.data

    // 当下载内容时候，没有code字段，直接将文件内容返回
    if (code === undefined) {
      console.log('@@@')
      return response
    }

    const requestUrl = response.config.url // 请求url
    response.data.data = responseDataFormatter(requestUrl as string, data)

    // 未登录
    if (code === ServiceCode.NoLoginError) {
      useUserStore().doLogout()
      return Promise.reject(
        new Error(description || '未登录或登录信息过期，请重新登录')
      )
    }

    // 下载内容时服务器错误，无法返回正确内容
    if (code === ServiceCode.ServerError) {
      return Promise.reject(
        new Error(description || '服务器错误，无法正确返回内容')
      )
    }

    // 其他业务错误
    if (code !== ServiceCode.Success) {
      console.error('[interceptor.response]: non-zero code', response.data)
      return Promise.reject(new Error(description || '服务器出错'))
    }

    useStyleStore().showLoading = false
    return response.data
  },
  errorHandler
)

// 封装通用axios请求函数
async function request<T>(config: AxiosRequestConfig) {
  return service.request<T>(config).then((responseData) => responseData.data)
}

export default request
