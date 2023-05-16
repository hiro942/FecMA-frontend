<template>
  <n-card>
    <task-list v-if="myTasks" :tasks="myTasks" :is-mytask-list="true" />
  </n-card>
</template>

<script lang="ts" setup>
import { fetchMyTask } from '@/api/fLearning'
import TaskList from '@/views/task-list/TaskList.vue'
import { onBeforeMount, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { normalTaskFilter } from '@/utils/filters'

const message = useMessage()

const myTasks = ref<FLearningModels.Task[]>()
onBeforeMount(async () => {
  try {
    myTasks.value = await fetchMyTask()
    myTasks.value = normalTaskFilter(myTasks.value)
  } catch (err: any) {
    message.error(err.message)
  }
})
</script>