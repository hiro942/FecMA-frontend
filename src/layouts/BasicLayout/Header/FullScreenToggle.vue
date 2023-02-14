<template>
  <n-icon
    class="text-2xl hover:scale-125 duration-500 cursor-pointer"
    @click="handleFullScreen"
  >
    <ScanCircleOutline />
  </n-icon>
</template>

<script setup lang="ts">
import { ScanCircleOutline } from '@vicons/ionicons5'
import screenfull from 'screenfull'

const handleFullScreen = () => {
  screenfull.toggle()
}
</script>
