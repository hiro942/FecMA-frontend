/*  获取任务详情 */
import request from '@/plugins/request'

const bcApi = {
  FetchBlocks: '/blockchain/blocks',
  FetchTransaction: '/blockchain/transaction',
}

export async function fetchBlocks() {
  return request<BlockchainModels.Block[]>({
    url: bcApi.FetchBlocks,
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
