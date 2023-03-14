import { defineStore } from 'pinia'

const useStyleStore = defineStore('style', () => {
  const isReloading = false // 组件刷新
  const isCollapsed = false // 侧边栏收缩
  const showLoading = false // 组件loading（控制 v-loading 指令）

  return {
    isCollapsed,
    isReloading,
    showLoading,
  }
})

export default useStyleStore
