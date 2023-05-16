<template>
  <n-card>
    <n-h3>服务器状态</n-h3>
    <div class="flex items-center justify-center">
      <div class="w-[160px]">CPU({{ cpuStatus.logicalCores }}核)</div>
      <n-progress
        type="line"
        indicator-placement="inside"
        :status="getStatus(cpuStatus.percentage)"
        :percentage="parseInt(cpuStatus.percentage.toFixed(0))"
      />
    </div>

    <div class="mt-3 flex items-center justify-center">
      <div class="w-[160px]">RAM({{ memoryStatus.free }}可用)</div>
      <n-progress
        type="line"
        indicator-placement="inside"
        :status="getStatus(memoryStatus.percentage)"
        :percentage="parseInt(memoryStatus.percentage.toFixed(0))"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
const props = defineProps<{ serverStatus: ServerStatusModels.HardwareStatus }>()
const { cpuStatus, memoryStatus } = props.serverStatus

const getStatus = (percentage: number) => {
  if (percentage >= 80) {
    return 'error'
  }
  if (percentage < 50) {
    return 'success'
  }
  return 'warning'
}
</script>
