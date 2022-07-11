<template>
  <div class="top-grid">
    <TaskStatusCards />
    <ServerStatus />
  </div>

  <div class="middle-grid">
    <!-- <Chart /> -->
    <div>带娃的加速度</div>
    <div class="recommend-list">推荐列表</div>
  </div>

  <div class="model-list">已有模型</div>
</template>

<script setup lang="ts">
import TaskStatusCards from '@/components/dashboard/TaskStatusCards.vue'
import ServerStatus from '@/components/dashboard/ServerStatus.vue'
import Chart from '@/components/dashboard/Chart.vue'
</script>

<script lang="ts">
export default {
  name: 'Dashboard',
}
</script>

<style scoped lang="scss">
.top-grid {
  margin-bottom: 30px;
  display: grid;
  grid-column-gap: 30px;
  grid-template-columns: 2.5fr 1fr;
}
.middle-grid {
  display: grid;
  grid-column-gap: 30px;
  grid-template-columns: 2fr 1fr;
}
.model-list {
  height: 400px;
  border: 1px solid red;
}
</style>
