interface ILocalStorage {
  startTime: number // 开始时间
  expires: number // 有效期
  data: any // 具体内容
}

export function getLocal(name: string) {
  const dataJSON = localStorage.getItem(name)
  if (!dataJSON) {
    return ''
  }
  return JSON.parse(dataJSON)
}

export function setLocal(
  name: string,
  data: any,
  expires: number = 3600 * 24 * 30 * 1000
) {
  // 如果token内存在由后端设置的有效期，并且由后端判断是否过期，前端就不需要设置了
  // if(name === 'token') {
  //     localStorage.setItem(name, JSON.stringify(data))
  //     return
  // }
  const local: ILocalStorage = {
    startTime: Date.now(),
    expires,
    data,
  }
  localStorage.setItem(name, JSON.stringify(local))
}

export async function useLocal(name: string): Promise<any> {
  const local: ILocalStorage = getLocal(name)
  if (!local) {
    return Promise.reject(new Error(`${name}不存在`))
  }
  if (local.startTime + local.expires < Date.now()) {
    return Promise.reject(new Error(`${name}已过期`))
  }
  return Promise.resolve(local.data)
}

export function removeLocal(name: string) {
  localStorage.removeItem(name)
}
