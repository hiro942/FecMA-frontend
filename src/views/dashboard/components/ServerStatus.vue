<template>
  <n-h3 style="margin-bottom: -10px">服务器状态</n-h3>
  <RingGauge
    v-if="gaugeData"
    chart-id="server-status"
    :gauge-data="gaugeData"
  />
</template>

<script setup lang="ts">
import { fetchHardwareStatus } from '@/api/serverStatus'
import { ref, onBeforeMount } from 'vue'
import RingGauge from '@/components/charts/RingGauge.vue'

const gaugeData = ref()
onBeforeMount(async () => {
  const { cpuStatus, memoryStatus } = await fetchHardwareStatus()
  gaugeData.value = [
    {
      name: 'CPU使用率',
      value: cpuStatus.percentage,
    },
    {
      name: `内存使用率(总${memoryStatus.total}GB)`,
      value: memoryStatus.percentage,
    },
  ]
})
</script>
