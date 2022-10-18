<template>
  <task-list v-if="myTasks" :tasks="myTasks" :is-mytask-list="true" />
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/components/TaskList.vue'
import { ref, onBeforeMount } from 'vue'

const myTasks = ref()
onBeforeMount(async () => {
  myTasks.value = await fetchMyTask()
})
</script>
