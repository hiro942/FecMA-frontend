import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''
  return {
    searchTaskName, filterTaskState,
  }
})

export default useGlobalStateStore
