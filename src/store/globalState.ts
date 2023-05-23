import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalStateStore', () => {
  const searchTaskName = ''
  const filterTaskState = ''
  const requestingCnt = 0

  const taskDetailModalVisible = false
  const taskAcceptModalVisible = false
  const taskResultModalVisible = false
  const transactionModalVisible = false
  const inferenceModalVisible = false

  const doTaskAssignFormValidate = false
  const taskAssignFormValid = true

  return {
    searchTaskName,
    filterTaskState,
    requestingCnt,

    taskDetailModalVisible,
    taskAcceptModalVisible,
    taskResultModalVisible,
    transactionModalVisible,
    inferenceModalVisible,

    doTaskAssignFormValidate,
    taskAssignFormValid,
  }
})

export default useGlobalStateStore
