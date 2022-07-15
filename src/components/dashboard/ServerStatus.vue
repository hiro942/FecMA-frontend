<template>
  <div class="server-status">
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
import { ref, onBeforeMount } from 'vue'

const hardwareStatus = ref()
onBeforeMount(async () => {
  hardwareStatus.value = await fetchHardwareStatus()
})
</script>

<script lang="ts">
export default {
  name: 'ServerStatus',
}
</script>

<style scoped lang="scss">
.server-status {
  display: grid;
  grid-column-gap: 5px;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  border: 2px solid black;
  border-radius: 8px;

  .card-item {
    .title {
      margin-bottom: 20px;
    }

    span {
      font-weight: bold;
      font-size: 24px;
    }
  }
}
</style>
