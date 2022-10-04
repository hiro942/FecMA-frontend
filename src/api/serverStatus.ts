import request from '@/plugins/request'

const serverStatusApi = {
  FetchHardwareStatus: '/status/hardware',
}

/* 获取硬件（cpu 和 memory）使用状态 */
export async function fetchHardwareStatus() {
  return request<ServerStatusModels.HardwareStatus>({
    url: serverStatusApi.FetchHardwareStatus,
    method: 'GET',
  })
}
