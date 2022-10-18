<template>
  <div v-if="hardwareStatus" class="server-status">
    <div class="card-item">
      <div class="title">CPU使用</div>
      <div>
        <span>{{ hardwareStatus.cpuStatus.percentage }}</span
        >% / <span>{{ hardwareStatus.cpuStatus.logicalCores }}</span
        >核
      </div>
    </div>
    <div class="card-item">
      <div class="title">内存使用</div>
      <div>
        <span>{{
          hardwareStatus.memoryStatus.used.slice(
            0,
            hardwareStatus.memoryStatus.used.length - 1
          )
        }}</span
        >{{
          hardwareStatus.memoryStatus.total.slice(
            hardwareStatus.memoryStatus.used.length - 1
          )
        }}
        /
        <span>{{
          hardwareStatus.memoryStatus.total.slice(
            0,
            hardwareStatus.memoryStatus.total.length - 1
          )
        }}</span
        >{{
          hardwareStatus.memoryStatus.total.slice(
            hardwareStatus.memoryStatus.total.length - 1
          )
        }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchHardwareStatus } from '@/api/serverStatus'
import { ref, onBeforeMount, nextTick } from 'vue'

const hardwareStatus = ref()
onBeforeMount(async () => {
  hardwareStatus.value = await fetchHardwareStatus()
})
</script>

<style scoped lang="scss">
.server-status {
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .card-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: bold;
      font-size: 24px;
    }
  }
}
</style>
