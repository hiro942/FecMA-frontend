<template>
  <n-layout-header>
    <n-space align="center" justify="end">
      <ReloadToggle />
      <MessageToggle />
      <FullScreenToggle />
      <AvatarDropdown />
    </n-space>

    <HistoryTabs />
  </n-layout-header>
</template>

<script setup lang="ts">
import FullScreenToggle from '@/layouts/BasicLayout/components/Header/components/FullScreenToggle.vue'
import AvatarDropdown from '@/layouts/BasicLayout/components/Header/components/AvatarDropdown.vue'
import MessageToggle from '@/layouts/BasicLayout/components/Header/components/MessageToggle.vue'
import ReloadToggle from '@/layouts/BasicLayout/components/Header/components/ReloadToggle.vue'
import HistoryTabs from '@/layouts/BasicLayout/components/Header/components/HistoryTabs.vue'
</script>

<style>
/*所有头部按钮的样式*/
.header-controller {
  width: 30px;
  height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.n-layout-header {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
