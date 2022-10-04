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
import Logo from '@/layouts/BasicLayout/components/Sider/components/Logo.vue'
import Menu from '@/layouts/BasicLayout/components/Sider/components/Menu.vue'
import useStyleStore from '@/store/modules/style'

const styleStore = useStyleStore()
</script>
