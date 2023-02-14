import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''

  const taskDetailModalVisible = false
  const taskAcceptModalVisible = false
  const taskResultModalVisible = false
  const transactionModalVisible = false
  const inferenceModalVisible = false

  return {
    searchTaskName,
    filterTaskState,
    taskDetailModalVisible,
    taskAcceptModalVisible,
    taskResultModalVisible,
    transactionModalVisible,
    inferenceModalVisible,
  }
})

export default useGlobalStateStore
