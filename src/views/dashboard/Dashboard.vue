<template>
  <div class="top-grid">
    <TaskStatusCards />
    <ServerStatus />
  </div>

  <div class="middle-grid">
    <!-- <Chart /> -->
    <div></div>
    <div class="blockchain-info">区块链信息</div>
  </div>

  <div class="model-list">已有模型</div>
</template>

<script setup lang="ts">
import TaskStatusCards from '@/components/dashboard/TaskStatusCards.vue'
import ServerStatus from '@/components/dashboard/ServerStatus.vue'
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
  grid-template-columns: 2.5fr 1fr;

  .blockchain-info {
    height: 400px;
    border: 2px solid rgb(170, 177, 255);
  }
}

.model-list {
  height: 400px;
  border: 1px solid red;
}
</style>
