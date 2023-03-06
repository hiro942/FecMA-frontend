<template>
  <n-modal
    v-if='taskDetail'
    v-model:show='globalStateStore.taskDetailModalVisible'
    preset='card'
    style='width: 600px'
    title='任务详情'
    size='huge'
    :bordered='false'
  >
    <n-descriptions
      label-placement='left'
      :column='1'
      bordered
      label-style='width: 130px'
    >
      <n-descriptions-item :label='AliasCN.taskName'>
        {{ taskDetail.taskName }}
      </n-descriptions-item>
      <n-descriptions-item :label='AliasCN.modelID'>
        {{ taskDetail.modelID }}
      </n-descriptions-item>
      <n-descriptions-item :label='AliasCN.modelName'>
        {{ taskDetail.modelName }}
      </n-descriptions-item>
      <n-descriptions-item label='创建人'>
        {{ taskDetail.assigner.nickname }}
      </n-descriptions-item>
      <n-descriptions-item :label='AliasCN.timeLimit'>
        {{
          new Date(
            Date.parse(taskDetail.assignDateTime) + taskDetail.timeLimit
          ).toLocaleString()
        }}
      </n-descriptions-item>
      <n-descriptions-item :label='AliasCN.description'>
        {{ taskDetail.description }}
      </n-descriptions-item>
    </n-descriptions>

    <n-h4>任务数据特征</n-h4>
    <template v-if='taskDetail.featureNames instanceof Array'>
      <n-data-table
        :columns='featuresTableColumns'
        :data='taskDetail.featureNames'
        :max-height='250'
      />
    </template>

    <n-h4>现有参与方</n-h4>
    <n-data-table
      :columns='acceptorsTableColumns'
      :data='taskDetail.acceptors'
      :max-height='250'
    >
      <template #empty>
        暂无参与方
      </template>
    </n-data-table>
  </n-modal>
</template>

<script setup lang='ts'>
import { h } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NAvatar, useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'

const globalStateStore = useGlobalStateStore()
const message = useMessage()
const props = defineProps<{ taskDetail: FLearningModels.TaskDetail }>()


type Feature = {
  name: string
  description: string
}

const featuresTableColumns: DataTableColumns<Feature> = [
  {
    title: '特征名',
    key: 'name',
    align: 'center',
    width: '30%'
  },
  {
    title: '特征描述',
    key: 'description',
    align: 'center'
  }
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
            alignItems: 'center'
          }
        },
        [
          h(NAvatar, {
            src: row.avatarUrl,
            round: true,
            style: { display: 'block', marginRight: '10px' }
          }),
          h('div', {}, row.nickname)
        ]
      )
    }
  },
  {
    title: AliasCN.participateDateTime,
    key: 'participateDateTime',
    align: 'center',
    render: (row: Acceptor) =>
      dayjs(row.participateDateTime).format('YYYY-MM-DD HH:MM')
  }
]
</script>
