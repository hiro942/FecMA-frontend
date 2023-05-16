<template>
  <n-card>
    <task-list v-if="allTasks" :tasks="allTasks" :is-mytask-list="false" />
  </n-card>
</template>

<script lang="ts" setup>
import { fetchAllTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/TaskList.vue'
import { onBeforeMount, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { normalTaskFilter } from '@/utils/filters'

const message = useMessage()

const allTasks = ref<FLearningModels.Task[]>()
onBeforeMount(async () => {
  try {
    allTasks.value = await fetchAllTask()
    allTasks.value = normalTaskFilter(allTasks.value)
  } catch (err: any) {
    message.error(err.message)
  }
})
</script>