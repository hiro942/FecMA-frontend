import { ref } from 'vue'
import { defineStore } from 'pinia'

const useStyleStore = defineStore('style', () => {
  const isCollapsed = false

  const asideBgColor = '#000'
  const asideColor = '#fff'

  const sysBlue = '#4D70FF'

  const assignBtnLoading = ref(false)
  const showLoading = ref(false)

  return {
    asideBgColor,
    asideColor,
    isCollapsed,
    activeColor: sysBlue,
    assignBtnLoading,
    showLoading,
  }
})

export default useStyleStore
