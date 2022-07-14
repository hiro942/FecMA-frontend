interface ILocalStorage {
  startTime: number // 开始时间
  expires: number // 有效期
  data: any // 具体内容
}

export const LocalStorage = {
  LoginState: 'login-state',
  LoginForm: 'login-form',
  AssignResultCallback: 'assign-result-callback',
  AcceptResultCallback: 'accept-result-callback',
  TrainResultCallback: 'train-result-callback',
  Messages: 'messages',
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

export function insertLocal(name: string, newVal: string) {
  const local = getLocal(name)
  if (!local) {
    setLocal(LocalStorage.Messages, [newVal])
    return
  }
  console.log(local.data)
  local.data.push(newVal)
  setLocal(name, local.data)
}
