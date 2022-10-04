import request from '@/plugins/request'

const flApi = {
  TaskAssign: '/task/taskAssign',
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
export async function taskAssign(
  data: FLearningModels.TaskAssign.CommonSettings & {
    algorithmSettings: string
  }
) {
  return request<any>({
    url: flApi.TaskAssign,
    method: 'POST',
    data,
  })
}

/* 任务接收 */
export async function taskAccept(data: FLearningModels.TaskAcceptParams) {
  return request<any>({
    url: flApi.TaskAccept,
    method: 'POST',
    data,
  })
}

/* 任务开始 */
export async function taskTrain(data: FLearningModels.TaskTrainParams) {
  return request<any>({
    url: flApi.TaskTrain,
    method: 'POST',
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
  return request<FLearningModels.Task[]>({
    url: flApi.FetchMyTask,
    method: 'GET',
    data: {},
  })
}

/* 获取全部任务 */
export async function fetchAllTask() {
  return request<FLearningModels.Task[]>({
    url: flApi.FetchAllTask,
    method: 'GET',
    data: {},
  })
}

/*  获取任务详情 */
export async function fetchTaskDetail(modelID: string, serverID: string) {
  return request<FLearningModels.TaskDetail>({
    url: flApi.FetchTaskDetail(modelID, serverID),
    method: 'GET',
    data: {},
  })
}

/*  获取模型信息 */
export async function fetchModel(modelID: string) {
  // TODO: 模型结果以 JSON 字符串形式返回
  return request<string>({
    url: flApi.FetchModel(modelID),
    method: 'GET',
    data: {},
  })
}

/*  下载模型结果文件 */
export async function downloadModel(modelID: string) {
  return request<any>({
    url: flApi.DownloadModel(modelID),
    method: 'GET',
    responseType: 'blob',
    data: {},
  })
}
