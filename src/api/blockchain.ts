/*  获取任务详情 */
import request from '@/plugins/request'

const blockChainApi = {
  FetchBlockList: '/blockChain/blockInfo',
}

export async function fetchBlockList() {
  return request<BlockchainModels.Blockchain>({
    url: blockChainApi.FetchBlockList,
    method: 'GET',
    data: {},
  })
}
