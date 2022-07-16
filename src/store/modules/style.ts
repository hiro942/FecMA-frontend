import { ref } from 'vue'
import { defineStore } from 'pinia'

const useStyleStore = defineStore('style', () => {
  const asideBgColor = '#000'
  const asideColor = '#fff'
  const sysBlue = '#4D70FF'

  const isReloading = ref(false) // 组件刷新
  const isCollapsed = ref(false) // 侧边栏收缩
  const assignBtnLoading = ref(false) // 创建任务按钮loading
  const showLoading = ref(false) // 组件loading（控制 v-loading 指令）

  return {
    asideBgColor,
    asideColor,
    isCollapsed,
    isReloading,
    activeColor: sysBlue,
    assignBtnLoading,
    showLoading,
  }
})

export default useStyleStore
