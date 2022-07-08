<template>
  <task-list :tasks="myTasks" :is-mytask-list="true" />
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/components/fLearning/TaskList.vue'
import { timeFormatter } from '@/utils/formatters'

const myTasks = await fetchMyTask() // assignDateTime 未格式化
for (let i = 0; i < myTasks.length; i += 1) {
  myTasks[i].assignDateTime = timeFormatter(myTasks[i].assignDateTime)
}
</script>
