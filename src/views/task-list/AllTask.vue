<template>
  <task-list v-if="allTasks" :tasks="allTasks" :is-mytask-list="false" />
</template>

<script lang="ts" setup>
import { fetchAllTask, fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/components/TaskList.vue'
import { ref, onBeforeMount } from 'vue'

const allTasks = ref()
onBeforeMount(async () => {
  allTasks.value = await fetchAllTask()
})
</script>
