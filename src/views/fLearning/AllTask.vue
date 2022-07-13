<template>
  <task-list v-if="allTasks" :tasks="allTasks" :is-mytask-list="false" />
</template>

<script lang="ts" setup>
import { fetchAllTask } from '@/api/fLearning'
import TaskList from '@/components/fLearning/TaskList.vue'
import useUserStore from '@/store/modules/user'

const allTasks = await fetchAllTask()
</script>

<script lang="ts">
export default {
  name: 'AllTask',
}
</script>
