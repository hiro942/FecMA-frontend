<template>
  <div>
    <TaskStatusCards class="mb-3" :my-tasks="myTasks" />
    <ServerStatus
      class="mb-3"
      v-if="serverStatus"
      :server-status="serverStatus"
    />

    <n-grid cols="3" class="mb-3">
      <n-gi span="1" class="mr-3">
        <BlockchainStatistic />
      </n-gi>
      <n-gi span="2">
        <Recommend :all-tasks="allTasks" />
      </n-gi>
    </n-grid>

    <LatestTasks :latest-tasks="latestTasks" />
  </div>
</template>

<script setup lang="ts">
import TaskStatusCards from '@/views/dashboard/TaskStatusCards.vue'
import ServerStatus from '@/views/dashboard/ServerStatus.vue'
import Recommend from '@/views/dashboard/Recommend.vue'
import BlockchainStatistic from '@/views/dashboard/BlockchainStatistic.vue'
import { onBeforeMount, ref } from 'vue'
import { fetchAllTask, fetchMyTask } from '@/api/fLearning'
import { useRouter } from 'vue-router'
import LatestTasks from '@/views/dashboard/LatestTasks.vue'
import { fetchHardwareStatus } from '@/api/serverStatus'
import { useMessage } from 'naive-ui'

const router = useRouter()
const message = useMessage()

const myTasks = ref<FLearningModels.Task[]>([])
const allTasks = ref<FLearningModels.Task[]>([])

const serverStatus = ref()
const latestTasks = ref<FLearningModels.Task[]>([])

onBeforeMount(async () => {
  try {
    myTasks.value = await fetchMyTask()
    allTasks.value = await fetchAllTask()
    serverStatus.value = await fetchHardwareStatus()
    latestTasks.value = myTasks.value.slice(0, 3)
  } catch (err: any) {
    message.error(err.message)
  }
})
</script>
