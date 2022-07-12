import { defineStore } from 'pinia'

const useLayoutStore = defineStore('layout', () => {
  const isCollapsed = false

  const asideBgColor = '#000'
  const asideColor = '#fff'

  const sysBlue = '#4D70FF'

  return {
    asideBgColor,
    asideColor,
    isCollapsed,
    activeColor: sysBlue,
  }
})

export default useLayoutStore
