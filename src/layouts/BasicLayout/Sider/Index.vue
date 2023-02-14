<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="styleStore.isCollapsed"
    show-trigger
    @collapse="styleStore.isCollapsed = true"
    @expand="styleStore.isCollapsed = false"
  >
    <Logo />
    <Menu />
  </n-layout-sider>
</template>

<script setup lang="ts">
import Logo from '@/layouts/BasicLayout/Sider/Logo.vue'
import Menu from '@/layouts/BasicLayout/Sider/Menu.vue'
import useStyleStore from '@/store/style'
import { onBeforeMount, onMounted } from 'vue'

const styleStore = useStyleStore()

// 初始化页面resize回调
onMounted(() => {
  window.onresize = () => {
    const screenWidth = document.body.offsetWidth
    styleStore.isCollapsed = screenWidth < 1200
  }
})
</script>
