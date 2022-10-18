<template>
  <n-modal
    v-model:show="globalState.taskDetailModalVisible"
    preset="card"
    style="width: 600px"
    title="任务详情"
    size="huge"
    :bordered="false"
  >
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 130px"
    >
      <n-descriptions-item :label="AliasCN.taskName">
        {{ taskDetail.taskName }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.modelID">
        {{ taskDetail.modelID }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.modelName">
        {{ taskDetail.modelName }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.nickname">
        {{ taskDetail.assigner.nickname }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.timeLimit">
        {{
          new Date(
            Date.parse(taskDetail.assignDateTime) + taskDetail.timeLimit
          ).toLocaleString()
        }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.description">
        {{ taskDetail.description }}
      </n-descriptions-item>
    </n-descriptions>

    <h4><em>任务数据特征</em></h4>
    <n-data-table
      :columns="featuresTableColumns"
      :data="taskDetail.featureNames"
      :max-height="250"
    />

    <h4><em>现有参与方</em></h4>
    <n-data-table
      :columns="acceptorsTableColumns"
      :data="taskDetail.acceptors"
      :pagination="{ pageSize: 5 }"
      :bordered="false"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { fetchTaskDetail } from '@/api/fLearning'
import { NAvatar, useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/modules/globalState'
import type { DataTableColumns } from 'naive-ui'
import { AliasCN } from '@/constants/alias'

const globalState = useGlobalStateStore()
const message = useMessage()
const props = defineProps<{ task: FLearningModels.Task }>()

const taskDetail = ref()

taskDetail.value = await fetchTaskDetail(props.task.modelID, props.task.partyID)

type Feature = {
  name: string
  description: string
}

const featuresTableColumns: DataTableColumns<Feature> = [
  {
    title: '特征名',
    key: 'name',
    align: 'center',
    width: '30%',
  },
  {
    title: '特征描述',
    key: 'description',
    align: 'center',
  },
]

type Acceptor = {
  nickname: string
  avatarUrl: string
  participateDateTime: string
}

const acceptorsTableColumns: DataTableColumns<Acceptor> = [
  {
    title: AliasCN.nickname,
    key: 'nickname',
    align: 'center',
    render(row: Acceptor) {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        },
        [
          h(NAvatar, {
            src: row.avatarUrl,
            round: true,
            style: { display: 'block', marginRight: '10px' },
          }),
          h('div', {}, row.nickname),
        ]
      )
    },
  },
  {
    title: AliasCN.participateDateTime,
    key: 'participateDateTime',
    align: 'center',
  },
]
</script>
