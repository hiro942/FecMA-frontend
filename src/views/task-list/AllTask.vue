<template>
  <n-card>
    <task-list :tasks="allTasks" :is-mytask-list="false" />
  </n-card>
</template>

<script lang="ts" setup>
import { fetchAllTask, fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/TaskList.vue'
import { ref, onBeforeMount } from 'vue'

const allTasks = ref<FLearningModels.Task[]>([])
onBeforeMount(async () => {
  allTasks.value = await fetchAllTask()
})
</script>
