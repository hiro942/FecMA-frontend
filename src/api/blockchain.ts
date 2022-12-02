/*  获取任务详情 */
import request from '@/plugins/request'

const blockChainApi = {
  FetchBlockList: '/blockchain/blocks',
  FetchTransaction: '/blockchain/transaction',
}

export async function fetchBlockList() {
  return request<BlockchainModels.Block[]>({
    url: blockChainApi.FetchBlockList,
    method: 'GET',
    data: {},
  })
}

export async function fetchTransaction() {
  return request<BlockchainModels.Transaction>({
    url: blockChainApi.FetchTransaction,
    method: 'GET',
    data: {},
  })
}
