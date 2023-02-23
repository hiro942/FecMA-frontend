<template>
  <n-card>
    <task-list v-if="allTasks" :tasks="allTasks" :is-mytask-list="false" />
  </n-card>
</template>

<script lang="ts" setup>
import { fetchAllTask, fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/TaskList.vue'
import { ref, onBeforeMount } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const allTasks = ref<FLearningModels.Task[]>()
onBeforeMount(async () => {
  try {
    allTasks.value = await fetchAllTask()
  } catch (err: any) {
    message.error(err.message)
  }
})
</script>
