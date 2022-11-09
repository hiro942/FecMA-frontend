<template>
  <n-space v-if="cpu && memory" justify="space-around" align="center">
    <n-progress
      type="circle"
      :percentage="parseInt(cpu.percentage)"
      :status="cpuCircleColor"
    >
      <span style="text-align: center">CPU使用率</span>
    </n-progress>
    <n-progress
      type="circle"
      :percentage="parseInt(memory.percentage)"
      :status="memoryCircleColor"
    >
      <span style="text-align: center">内存使用率</span>
    </n-progress>
  </n-space>
</template>

<script setup lang="ts">
import { fetchHardwareStatus } from '@/api/serverStatus'
import { ref, onBeforeMount } from 'vue'

const cpu = ref()
const memory = ref()
const cpuCircleColor = ref<any>('success')
const memoryCircleColor = ref<any>('success')
onBeforeMount(async () => {
  const { cpuStatus, memoryStatus } = await fetchHardwareStatus()
  cpu.value = cpuStatus
  memory.value = memoryStatus

  if (cpuStatus.percentage >= 30 && cpuStatus.percentage < 50) {
    cpuCircleColor.value = 'info'
  } else if (cpuStatus.percentage >= 50 && cpuStatus.percentage < 80) {
    cpuCircleColor.value = 'warning'
  } else if (cpuStatus.percentage >= 80) {
    cpuCircleColor.value = 'error'
  }

  if (memoryStatus.percentage >= 30 && memoryStatus.percentage < 50) {
    memoryCircleColor.value = 'info'
  } else if (memoryStatus.percentage >= 50 && memoryStatus.percentage < 80) {
    memoryCircleColor.value = 'warning'
  } else if (memoryStatus.percentage >= 80) {
    memoryCircleColor.value = 'error'
  }
})
</script>
