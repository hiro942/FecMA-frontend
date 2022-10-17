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

  FetchModelList: '/model/list',
  FetchInferenceResult: '/model/inferenceResult',
  DownloadInferenceResult: '/model/inferenceResultDownload',
}

/* 任务创建 */
export async function taskAssign(
  data: FLearningModels.TaskAssign.CommonSettings &
    FLearningModels.TaskAssign.DatasetInfo & {
      modelParam: string // 模型算法配置，JSON形式
      featureParam: string // 特征工程配置，JSON形式
    }
) {
  return request<any>({
    url: flApi.TaskAssign,
    method: 'POST',
    data,
    headers: {
      contentType: 'multipart/form-data',
    },
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
export async function fetchTaskResult(modelID: string) {
  // TODO: 模型结果以 JSON 字符串形式返回
  return request<string>({
    url: flApi.FetchTaskResult(modelID),
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

/*  获取用户已有模型 */
export async function fetchModelList() {
  return request<FLearningModels.Model[]>({
    url: flApi.FetchModelList,
    method: 'GET',
    data: {},
  })
}

/*  获取用户已得到的模型列表 */
export async function fetchInferenceResult() {
  return request<any>({
    url: flApi.FetchInferenceResult,
    method: 'GET',
    data: {},
  })
}

/*  下载推理结果文件 */
export async function downloadInferenceResult(modelID: string) {
  return request<any>({
    url: flApi.DownloadInferenceResult,
    method: 'GET',
    responseType: 'blob',
    data: {},
  })
}
