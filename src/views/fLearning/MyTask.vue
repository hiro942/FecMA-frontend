<template>
  <task-list :tasks="myTasks" :is-mytask-list="true" />
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/components/fLearning/TaskList.vue'

const myTasks = await fetchMyTask()
</script>
