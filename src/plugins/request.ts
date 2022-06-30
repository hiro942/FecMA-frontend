import axios, { AxiosRequestConfig } from 'axios'
import { ElNotification } from 'element-plus'
import { getLocal } from '@/utils/useLocalStorage'

// 学校服务器地址 -> http://10.99.12.103:88/api
// 测试服务器地址 -> http://39.105.102.235:88/api
// 局域网测试地址 -> http://10.128.252.195:88/api
// Apifox -> http://127.0.0.1:4523/m1/1118652-0-default

// 创建axios服务实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: 'http://10.99.12.103:88/api', // url = base url + request url
  timeout: 60000, // request timeout
  withCredentials: true, // 跨域请求携带cookie等凭证信息
})

// 全局请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log(`request url: ${config.baseURL}${config.url}`)
    // todo
    // 请求前在头部附加token
    // const token = getLocal('token')
    // if (token) {
    //     // @ts-ignore
    //     config.headers.token = token
    // }
    return config
  },
  (error) => {
    console.log('请求出错', error) // for debug
    return Promise.reject(error)
  },
)

// 全局响应拦截器
service.interceptors.response.use(
  (response) => response,
  // console.log(`get response ${JSON.stringify(response)}`)
  // const res: API.BaseResponse = response.data
  // if (res.code !== 0) {
  //     console.log('接口信息报错' + res)
  //     return Promise.reject(new Error(res.description || 'Error'))
  // }
  (error) => {
    console.log('响应出错', JSON.stringify(error))
    return Promise.reject(error)
  },
)

// 响应异常拦截处理
// const errorHandler = (error: any) => {
//   console.log('errorHandler')
//   if (error.response) {
//     const { status, data } = error.response
//     if (status === 401) {
//       ElNotification.error('UnAuthorized')
//     }
//     if (status === 403) {
//       ElNotification.error('Forbidden')
//     }
//   }
//   console.log('响应出错', error)
//   return Promise.reject(error)
// }

// 封装通用axios请求函数
async function request<T>(config: AxiosRequestConfig) {
  return service.request<API.BaseResponse<T>>(config).then((res) => {
    if (res.data.code !== 0) {
      console.log('接口信息报错，请求：', config)
      console.log('接口信息报错，响应：', res)
      return Promise.reject(new Error(res.data.description || 'Error'))
    }
    console.log('get response:', res.data)
    return res.data.data
  })
}

export default request
