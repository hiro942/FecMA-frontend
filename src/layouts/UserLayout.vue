<template>
  <n-layout class='text-center'>
    <n-layout-header>
      <n-image preview-disabled width='100' :src='fedmaLogo' alt='logo' />
    </n-layout-header>
    <n-layout-content content-style='padding: 24px;'>
      <router-view />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang='ts'>
import fedmaLogo from '@/assets/fedma.png'

nextTick(() => {
})
</script>
