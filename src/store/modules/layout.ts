import { defineStore } from 'pinia'

const useLayoutStore = defineStore('layout', () => {
  const isCollapsed = false

  const asideBgColor = '#000'
  const asideColor = '#fff'

  const sysBlue = '#4D70FF'

  const taskDetailDialogVisible = false
  const taskAcceptDialogVisible = false
  const taskResultDialogVisible = false

  return {
    asideBgColor,
    asideColor,
    isCollapsed,
    activeColor: sysBlue,
    taskDetailDialogVisible,
    taskAcceptDialogVisible,
    taskResultDialogVisible,
  }
})

export default useLayoutStore
