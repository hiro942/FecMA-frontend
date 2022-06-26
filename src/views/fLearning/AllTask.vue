<template>
  <task-list :tasks="allTasks" :is-mytask-list="false" />
</template>

<script lang="ts" setup>
import { fetchAllTask } from '@/api/fLearning'
import TaskList from '@/components/fLearning/TaskList.vue'
import { timeFormatter } from '@/utils/formatters'

const allTasks = await fetchAllTask() // assignDateTime 未格式化
for (let i = 0; i < allTasks.length; i += 1) {
  allTasks[i].assignDateTime = timeFormatter(allTasks[i].assignDateTime)
}
</script>
