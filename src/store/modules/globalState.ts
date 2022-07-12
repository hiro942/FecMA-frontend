import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''

  const userInfoResetDialogVisible = false
  const taskDetailDialogVisible = false
  const taskAcceptDialogVisible = false
  const taskResultDialogVisible = false

  return {
    searchTaskName,
    filterTaskState,
    userInfoResetDialogVisible,
    taskDetailDialogVisible,
    taskAcceptDialogVisible,
    taskResultDialogVisible,
  }
})

export default useGlobalStateStore
