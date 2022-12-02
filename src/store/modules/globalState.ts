import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''

  const userInfoResetModalVisible = false
  const taskDetailModalVisible = false
  const taskAcceptModalVisible = false
  const taskResultModalVisible = false
  const transactionModalVisible = false
  const inferenceModalVisible = false

  return {
    searchTaskName,
    filterTaskState,
    userInfoResetModalVisible,
    taskDetailModalVisible,
    taskAcceptModalVisible,
    taskResultModalVisible,
    transactionModalVisible,
    inferenceModalVisible,
  }
})

export default useGlobalStateStore
