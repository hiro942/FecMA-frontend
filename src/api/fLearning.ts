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
  FetchModelMetric: (modelID: string) => `/model/metrics?modelID=${modelID}`,
  FetchModelMetricAll: (modelID: string) =>
    `/model/getMetric_All?modelID=${modelID}`,
  FetchModelList: '/model/myModel',
  FetchInferenceHistoryList: (modelID: string) =>
    `/model/history?modelID=${modelID}`,
  ModelInference: '/model/inference',
  ModelInferenceIPv6: '/addressInference/inference',
  FetchAddressInferenceTaskList: '/addressInference/allTask',
}

/* 任务创建 */
export async function taskAssign<T>(data: T) {
  return request({
    url: flApi.TaskAssign,
    method: 'POST',
    data,
  })
}

/* 任务接收 */
export async function taskAccept(data: FLearningModels.TaskAcceptParams) {
  return request({
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

/*  获取模型指标信息 */
export async function fetchModelMetric(modelID: string) {
  return request<string>({
    url: flApi.FetchModelMetric(modelID),
    method: 'GET',
    data: {},
  })
}

/*  获取模型指标信息2 */
export async function fetchModelMetricAll(modelID: string) {
  return request<string>({
    url: flApi.FetchModelMetricAll(modelID),
    method: 'GET',
    data: {},
  })
}

/*  获取用户已有模型 */
export async function fetchModelList() {
  return request<FLearningModels.Task[]>({
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

/* 模型推理 - IPv6 地址推断 */
export async function modelInferenceIPv6(data: {
  modelID: string
  inferenceFile: File
}) {
  return request<any>({
    url: flApi.ModelInferenceIPv6,
    method: 'POST',
    data,
  })
}

export async function fetchIPv6TaskList() {
  return request<any>({
    url: flApi.FetchAddressInferenceTaskList,
    method: 'GET',
    data: {},
  })
}
