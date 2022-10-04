<template>
  <div class="header-controller" @click="onFullScreenToggleClick">
    <n-icon :size="18" :component="Scan" />
  </div>
</template>

<script setup lang="ts">
import { Scan } from '@vicons/ionicons5'
import screenfull from 'screenfull'

const onFullScreenToggleClick = () => {
  screenfull.toggle()
}
</script>
