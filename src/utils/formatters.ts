// 时间格式化。eg: [2022-06-10T13:10:19.200245+08:00] -> [2022-06-10 13:10:19]
export const timeFormatter = (val: string) =>
  val.slice(0, 19).split('').join('').replace('T', ' ')

// 格式化/处理响应数据内的 data 字段
export const responseDataFormatter = (requestUrl: string, data: any) => {
  // [my task, all task]，把数据里面的time统一格式化之后再返回
  if (requestUrl === '/task/mytask' || requestUrl === '/task/allTask') {
    const tasks = data as FLearningAPI.TaskInfo[] // 得到返回的tasks
    for (let i = 0; i < tasks.length; i += 1) {
      tasks[i].assignDateTime = timeFormatter(tasks[i].assignDateTime)
    }
    return tasks
  }

  // [fetch model] 返回JSON字符串，真正的数据在改JSON的data字段里面
  if (requestUrl.includes('/task/getResult')) {
    return JSON.parse(data).data
  }

  return data
}
