/*  获取任务详情 */
import request from '@/plugins/request'

const bcApi = {
  FetchBlockList: '/blockchain/blocks',
  FetchTransaction: '/blockchain/transaction',
}

export async function fetchBlockList() {
  return request<BlockchainModels.Block[]>({
    url: bcApi.FetchBlockList,
    method: 'GET',
    data: {},
  })
}

export async function fetchTransaction() {
  return request<BlockchainModels.Transaction>({
    url: bcApi.FetchTransaction,
    method: 'GET',
    data: {},
  })
}
