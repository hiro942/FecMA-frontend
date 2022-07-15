import request from '@/plugins/request'

const flApi = {
  TaskAssign: '/task/assign',
  TaskAccept: '/task/accept',
  TaskTrain: '/task/train',
  FetchTaskResult: '/task/async_train_result?modelID=xxx',
  FetchTaskList: '/task/allTask',
  FetchMyTask: '/task/mytask',
  FetchAllTask: '/task/allTask',
  FetchTaskDetail: (modelID: string, serverID: string) =>
    `/task/detail?modelID=${modelID}&serverID=${serverID}`,
  FetchModel: (modelID: string) => `/task/getResult?modelID=${modelID}`,
  DownloadModel: (modelID: string) => `task/resultDownload?modelID=${modelID}`,
}

/* 任务创建 */
export async function taskAssign(data: FLearningAPI.TaskAssignParams) {
  return request<FLearningAPI.Callback>({
    url: flApi.TaskAssign,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/* 任务接收 */
export async function taskAccept(data: FLearningAPI.TaskAcceptParams) {
  return request<FLearningAPI.Callback>({
    url: flApi.TaskAccept,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/* 任务开始 */
export async function taskTrain(data: FLearningAPI.TaskTrainParams) {
  return request<FLearningAPI.Callback>({
    url: flApi.TaskTrain,
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data,
  })
}

/* 获取任务创建结果 */
export async function fetchCallbackResult(url: string) {
  return request<string>({
    url,
    method: 'GET',
  })
}

/* 获取我的任务 */
export async function fetchMyTask() {
  return request<FLearningAPI.TaskInfo[]>({
    url: flApi.FetchMyTask,
    method: 'GET',
    data: {},
  })
}

/* 获取全部任务 */
export async function fetchAllTask() {
  return request<FLearningAPI.TaskInfo[]>({
    url: flApi.FetchAllTask,
    method: 'GET',
    data: {},
  })
}

/*  获取任务详情 */
export async function fetchTaskDetail(modelID: string, serverID: string) {
  return request<FLearningAPI.TaskDetail>({
    url: flApi.FetchTaskDetail(modelID, serverID),
    method: 'GET',
    data: {},
  })
}

/*  获取模型信息 */
export async function fetchModel(modelID: string) {
  // 模型结果以 JSON 字符串形式返回
  return request<string>({
    url: flApi.FetchModel(modelID),
    method: 'GET',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: {},
  })
}

/*  下载模型结果文件 */
export async function downloadModel(modelID: string) {
  return request<any>({
    url: flApi.DownloadModel(modelID),
    method: 'GET',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: {},
  })
}
