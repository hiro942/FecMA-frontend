<template>
  <n-card class="mt-3">
    <n-space justify="space-between" align="center">
      <n-h3>最新参与任务</n-h3>
      <n-button @click="$router.push({ name: 'MyTask' })">查看更多</n-button>
    </n-space>
    <n-data-table
      :bordered="false"
      :single-line="false"
      :columns="tableColumns"
      :data="latestTasks"
    />
  </n-card>
</template>

<script setup lang="ts">
import { DataTableColumns, NTag } from 'naive-ui'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'
import { h } from 'vue'

const props = defineProps<{ latestTasks: FLearningModels.Task[] }>()

const tableColumns: DataTableColumns<FLearningModels.Task> = [
  {
    title: AliasCN.taskName,
    key: 'taskName',
    align: 'center',
  },
  {
    title: AliasCN.assignDateTime,
    key: 'assignDateTime',
    align: 'center',
    render: (row: FLearningModels.Task) =>
      dayjs(row.assignDateTime).format('YYYY-MM-DD HH:MM'),
  },
  {
    title: '当前/最少参与方',
    key: 'peersRatio',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          size: 'small',
        },
        { default: () => `${row.currentPeers}/${row.minPeers}` }
      )
    },
  },
  {
    title: AliasCN.state,
    key: 'state',
    align: 'center',
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
