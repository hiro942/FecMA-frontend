import { ref } from 'vue'
import { defineStore } from 'pinia'

const useStyleStore = defineStore('style', () => {
  const isReloading = ref(false) // 组件刷新
  const isCollapsed = ref(false) // 侧边栏收缩
  const assignBtnLoading = ref(false) // 创建任务按钮loading
  const showLoading = ref(false) // 组件loading（控制 v-loading 指令）

  return {
    isCollapsed,
    isReloading,
    assignBtnLoading,
    showLoading,
  }
})

export default useStyleStore
