<template>
  <div>
    <div id="dashboard">
      <div class="top-grid">
        <TaskStatusCards />
        <ServerStatus />
      </div>

      <n-divider />

      <div class="middle-grid">
        <div><Chart /></div>
        <!--        <div><BlockchainStatistic /></div>-->
        <div class="blockchain-info">
          <Recommend />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TaskStatusCards from '@/views/dashboard/components/TaskStatusCards.vue'
import ServerStatus from '@/views/dashboard/components/ServerStatus.vue'
import Recommend from '@/views/dashboard/components/Recommend.vue'
import Chart from '@/views/dashboard/components/Chart.vue'
import BlockchainStatistic from '@/views/dashboard/components/BlockchainStatistic.vue'
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
}

.model-list {
  height: 400px;
  border: 1px solid red;
}
</style>
