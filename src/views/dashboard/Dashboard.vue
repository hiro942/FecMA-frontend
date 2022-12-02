<template>
  <div v-show="!styleStore.showLoading">
    <TaskStatusCards />
    <n-divider />
    <BlockchainStatistic />
    <n-divider />

    <n-grid cols="2">
      <n-gi span="1">
        <ServerStatus />
      </n-gi>
      <n-gi span="1">
        <Recommend />
      </n-gi>
    </n-grid>
    <n-divider />

    <n-space justify="space-between" align="center">
      <n-h3>最新参与任务</n-h3>
      <n-button text type="info" @click="handleViewMore">查看更多</n-button>
    </n-space>
    <n-data-table
      :bordered="false"
      :single-line="false"
      :columns="tableColumns"
      :data="tableData"
    />
  </div>
</template>

<script setup lang="ts">
import TaskStatusCards from '@/views/dashboard/components/TaskStatusCards.vue'
import ServerStatus from '@/views/dashboard/components/ServerStatus.vue'
import Recommend from '@/views/dashboard/components/Recommend.vue'
import useStyleStore from '@/store/modules/style'
import BlockchainStatistic from '@/views/dashboard/components/BlockchainStatistic.vue'
import { h, onBeforeMount, ref } from 'vue'
import { fetchMyTask } from '@/api/fLearning'
import { DataTableColumns, NButton, NTag } from 'naive-ui'
import { AliasCN } from '@/constants/alias'
import { useRouter } from 'vue-router'

const router = useRouter()
const styleStore = useStyleStore()

type TableData = FLearningModels.Task

const tableColumns: DataTableColumns<TableData> = [
  {
    title: AliasCN.taskName,
    key: 'taskName',
    align: 'center',
  },
  {
    title: AliasCN.assignDateTime,
    key: 'assignDateTime',
    align: 'center',
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

const handleViewMore = () => {
  router.push({ name: 'MyTask' })
}

const myTasks = ref()
const tableData = ref()
onBeforeMount(async () => {
  myTasks.value = await fetchMyTask()
  tableData.value = myTasks.value.slice(0, 3)
})
</script>
