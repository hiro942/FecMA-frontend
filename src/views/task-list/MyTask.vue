<template>
  <n-card>
    <task-list :tasks="myTasks" :is-mytask-list="true" />
  </n-card>
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/TaskList.vue'
import { ref, onBeforeMount } from 'vue'

const myTasks = ref<FLearningModels.Task[]>([])
onBeforeMount(async () => {
  myTasks.value = await fetchMyTask()
})
</script>
