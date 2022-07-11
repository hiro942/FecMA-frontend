import { defineStore } from 'pinia'

const useTaskListStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''
  return {
    searchTaskName,
    filterTaskState,
  }
})

export default useTaskListStateStore
