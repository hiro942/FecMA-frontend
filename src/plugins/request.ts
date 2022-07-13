import axios, { AxiosRequestConfig } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { timeFormatter } from '@/utils/formatters'
import { getLocal } from '@/utils/useLocalStorage'
import router from '@/router'
import useUserStore from '@/store/modules/user'

// 本地地址:        http://localhost:88/api
// 学校服务器地址 -> http://10.99.12.103:88/api
// 测试服务器地址 -> http://39.105.102.235:88/api
// 局域网测试地址 -> http://10.128.252.195:88/api
// Apifox -> http://127.0.0.1:4523/m1/1118652-0-default

console.log(import.meta.env)
// 创建axios服务实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API,
  baseURL: import.meta.env.DEV
    ? 'http://127.0.0.1:4523/m1/1118652-0-default'
    : 'http://localhost:88/api', // url = base url + request url
  timeout: 1000 * 60 * 5, // request timeout 5min
  withCredentials: true, // 跨域请求携带cookie等凭证信息
})

// 全局请求拦截器
service.interceptors.request.use(
  (config) => {
    console.log(`request url: ${config.baseURL}${config.url}`)
    // TODO
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
  }
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
  }
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
    // console.log(config.url)

    // Success      = 0     // 成功
    // ParamError   = 40000 // 请求参数错误
    // NullError    = 40001 // 请求数据为空
    // NoLoginError = 40100 // 未登录
    // AuthError    = 40101 // 无权限

    const { code, data, msg, description } = res.data

    // [未登录]: 撤销登录状态
    if (code === 40100) {
      const userStore = useUserStore()
      userStore.isLogin = false
      window.location.reload()
    }

    if (code !== 0) {
      console.log('接口信息报错，请求：', config)
      console.log('接口信息报错，响应：', res)
      return Promise.reject(new Error(description || '请求出错'))
    }
    console.log('get response:', res.data)

    // 如果是获取任务列表的接口，把数据里面的time统一格式化之后再返回
    if (config.url === '/task/mytask' || config.url === '/task/alltask') {
      const tasks = data as any // 得到返回的tasks
      for (let i = 0; i < tasks.length; i += 1) {
        tasks[i].assignDateTime = timeFormatter(tasks[i].assignDateTime)
      }
      return tasks as T
    }

    return data
  })
}

export default request
