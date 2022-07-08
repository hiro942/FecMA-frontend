// 获取特定 cookie 的 value
export const getCookie = (name: string) => {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i].trim()
    if (cookie.indexOf(name) === 0) return cookie.substring(name.length + 1)
  }
  return ''
}
