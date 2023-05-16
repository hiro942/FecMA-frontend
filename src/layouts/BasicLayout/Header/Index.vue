<template>
  <n-layout-header class="sticky top-0 z-10">
    <div
      class="h-[60px] flex items-center justify-end gap-4 border-b-gray-600 border-solid pl-4 pr-4"
    >
      <ReloadToggle />
      <!--      <MessageToggle />-->
      <FullScreenToggle />
      <AvatarDropdown />
    </div>
    <HistoryTabs class="h-[40px]" />
  </n-layout-header>
</template>

<script setup lang="ts">
import FullScreenToggle from '@/layouts/BasicLayout/Header/FullScreenToggle.vue'
import AvatarDropdown from '@/layouts/BasicLayout/Header/AvatarDropdown.vue'
import ReloadToggle from '@/layouts/BasicLayout/Header/ReloadToggle.vue'
import HistoryTabs from '@/layouts/BasicLayout/Header/HistoryTabs.vue'
</script>

<style scoped>
/*.n-layout-header {*/
/*  position: sticky;*/
/*  top: 0;*/
/*  z-index: 1;*/
/*}*/
</style>