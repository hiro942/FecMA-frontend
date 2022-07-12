<template>
  <task-list v-if="myTasks" :tasks="myTasks" :is-mytask-list="true" />
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/components/fLearning/TaskList.vue'
import { ref, onBeforeMount } from 'vue'

const myTasks = await fetchMyTask()
</script>

<script lang="ts">
export default {
  name: 'MyTask',
}
</script>
