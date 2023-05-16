<template>
  <n-card class="mt-3">
    <n-space justify="space-between" align="center">
      <n-h3>我的任务</n-h3>
      <n-button @click="$router.push({ name: 'MyTask' })">查看更多</n-button>
    </n-space>
    <n-data-table
      :bordered="false"
      :columns="tableColumns"
      :data="latestTasks"
    />
  </n-card>
</template>

<script setup lang="ts">
import { DataTableColumns, NTag } from 'naive-ui'
import { AliasCN } from '@/configs/maps'
import { h } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{ latestTasks: FLearningModels.Task[] }>()

const tableColumns: DataTableColumns<FLearningModels.Task> = [
  {
    title: AliasCN.modelID,
    key: 'modelID',
  },
  {
    title: AliasCN.taskName,
    key: 'taskName',
  },
  {
    title: AliasCN.assignDateTime,
    key: 'assignDateTime',
    render: (row: FLearningModels.Task) =>
      dayjs(row.assignDateTime).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: '参与方',
    key: 'currentPeers',
  },
  {
    title: AliasCN.state,
    key: 'state',
    render(row) {
      return h(
        NTag,
        {
          type: AliasCN[row.state].type,
          size: 'small',
        },
        { default: () => AliasCN[row.state].text }
      )
    },
  },
]
</script>

<style scoped></style>