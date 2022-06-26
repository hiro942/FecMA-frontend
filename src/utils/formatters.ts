// 时间格式化。eg: [2022-06-10T13:10:19.200245+08:00] -> [2022-06-10 13:10:19]
export const timeFormatter = (val: string) => val.slice(0, 19).split('').join('').replace('T', ' ')

export const b = () => {

}
