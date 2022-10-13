import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState: string | null = null

  const userInfoResetModalVisible = false
  const taskDetailModalVisible = false
  const taskAcceptModalVisible = false
  const taskResultModalVisible = false
  const blockDetailModalVisible = false
  const transactionModalVisible = false
  const inferenceModalVisible = false

  return {
    searchTaskName,
    filterTaskState,
    userInfoResetModalVisible,
    taskDetailModalVisible,
    taskAcceptModalVisible,
    taskResultModalVisible,
    blockDetailModalVisible,
    transactionModalVisible,
    inferenceModalVisible,
  }
})

export default useGlobalStateStore
