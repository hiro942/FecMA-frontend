import request from '@/plugins/request'

const flApi = {
  TaskAssign: '/task/assign',
  TaskAccept: '/task/accept',
  TaskTrain: '/task/train',
  FetchTaskList: '/task/allTask',
  FetchMyTask: '/task/mytask',
  FetchAllTask: '/task/allTask',
  FetchTaskDetail: (modelID: string, serverID: string) =>
    `/task/detail?modelID=${modelID}&serverID=${serverID}`,
  FetchTaskResult: (modelID: string) => `/task/getResult?modelID=${modelID}`,
  DownloadModel: (modelID: string) => `/task/resultDownload?modelID=${modelID}`,

  FetchModelList: '/model/myModel',
  FetchInferenceHistoryList: (modelID: string) =>
    `/model/history?modelID=${modelID}`,
  ModelInference: '/model/inference',
}

/* 任务创建 */
export async function taskAssign(data: any) {
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
export async function taskTrain(data: { modelID: string }) {
  return request<any>({
    url: flApi.TaskTrain,
    method: 'POST',
    data,
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
export async function fetchTaskResult(modelID: string) {
  // TODO: 模型结果以 JSON 字符串形式返回
  // TODO: 废弃
  return request<string>({
    url: flApi.FetchTaskResult(modelID),
    method: 'GET',
    data: {},
  })
}

/*  获取用户已有模型 */
export async function fetchModelList() {
  return request<FLearningModels.Model[]>({
    url: flApi.FetchModelList,
    method: 'GET',
    data: {},
  })
}

/*  获取模型推理历史记录 */
export async function fetchInferenceHistoryList(modelID: string) {
  return request<FLearningModels.InferenceHistory[]>({
    url: flApi.FetchInferenceHistoryList(modelID),
    method: 'GET',
    data: {},
  })
}

/* 模型推理 */
export async function modelInference(data: {
  modelID: string
  inferenceFile: File
}) {
  return request<any>({
    url: flApi.ModelInference,
    method: 'POST',
    data,
  })
}
