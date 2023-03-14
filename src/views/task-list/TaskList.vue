<template>
  <n-space align='center' justify='end' style='padding-bottom: 10px'>
    <n-checkbox
      v-if='props.isMytaskList'
      v-model:checked='onlyShowMyAssigned'
      size='large'
    >
      仅查看我创建的任务
    </n-checkbox>

    <n-select
      v-if='props.isMytaskList'
      v-model:value='selectedState'
      style='width: 180px'
      :options='stateFilterOptions'
      clearable
      placeholder='按任务状态筛选'
    >
      <template #arrow>
        <n-icon>
          <FilterOutline />
        </n-icon>
      </template>
    </n-select>

    <n-input v-model:value='searchText' placeholder='按任务名搜索'>
      <template #prefix>
        <n-icon>
          <SearchOutline />
        </n-icon>
      </template>
    </n-input>

    <n-button
      secondary
      strong
      type='error'
      @click="() => router.push({ name: 'TaskAssign' })"
    >
      <template #icon>
        <n-icon>
          <AddOutline />
        </n-icon>
      </template>
      创建新任务
    </n-button>
  </n-space>

  <n-data-table
    :single-line='false'
    :columns="
        props.isMytaskList
          ? tableColumns
          : tableColumns.filter((column: any) => column.key !== 'state')
      "
    :data='filteredTasks'
    :pagination='{ pageSize: 15 }'
  />

  <TaskDetail
    v-if='globalStateStoreStore.taskDetailModalVisible'
    :task-detail='taskDetail'
  />

  <TaskAccept
    v-if='globalStateStoreStore.taskAcceptModalVisible'
    :task='selectedTask'
  />

  <TaskResult
    v-if='globalStateStoreStore.taskResultModalVisible'
    :task='selectedTask'
  />
</template>

<script lang='ts' setup>
import TaskDetail from '@/views/task-list/TaskDetailModal.vue'
import TaskAccept from '@/views/task-list/TaskAcceptModal.vue'
import TaskResult from '@/views/task-list/TaskResultModal/Index.vue'
import { AddOutline, FilterOutline, SearchOutline } from '@vicons/ionicons5'
import { fetchTaskDetail, taskTrain } from '@/api/fLearning'
import { stateFilterOptions } from '@/configs/selectOptions'
import { computed, h, onActivated, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, useDialog, useMessage, useNotification } from 'naive-ui'
import { useRouter } from 'vue-router'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'

const router = useRouter()
const notification = useNotification()
const message = useMessage()
const dialog = useDialog()

const props = defineProps<{
  tasks: FLearningModels.Task[]
  isMytaskList: boolean
}>()

const globalStateStoreStore = useGlobalStateStore()
const searchText = ref('') // 搜索关键词
const selectedState = ref<null | string>() // 选择查看的任务状态
const onlyShowMyAssigned = ref(false) // 只显示我创建的任务

const taskDetail = ref()

const getInitState = () => {
  // 获取可能存在的筛选条件（eg: 从 dashboard 点击跳转）
  searchText.value = globalStateStoreStore.searchTaskName
  selectedState.value =
    globalStateStoreStore.filterTaskState === ''
      ? null
      : globalStateStoreStore.filterTaskState
}

onActivated(() => {
  getInitState()
})

onBeforeMount(() => {
  getInitState()
})

onBeforeUnmount(() => {
  // 组件卸载前清空筛选条件
  globalStateStoreStore.searchTaskName = ''
  globalStateStoreStore.filterTaskState = ''
})

type TableData = FLearningModels.Task

const selectedTask = ref() // 选择的任务

// 根据任务名过滤后的数据
const filteredTasks = computed(() =>
  props.tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchText.value.toLowerCase()) &&
      (task.state === selectedState.value || selectedState.value === null) &&
      (!onlyShowMyAssigned.value || task.isAssigner === 1)
  )
)

// 查看任务详情
const viewDetail = async (row: TableData) => {
  try {
    taskDetail.value = await fetchTaskDetail(
      row.modelID,
      row.partyID
    )
    globalStateStoreStore.taskDetailModalVisible = true
  } catch (err: any) {
    message.error(err.message)
  }
}

const taskAccept = (row: TableData) => {
  selectedTask.value = row
  globalStateStoreStore.taskAcceptModalVisible = true
}

const startTrain = (row: TableData) => {
  if (row.currentPeers < row.minPeers) {
    notification.error({
      title: '参与方数量不足',
      content: `至少需要${row.minPeers}个参与方，当前仅有${row.currentPeers}个参与方`,
      duration: 3000
    })
    return
  }
  const d = dialog.info({
    title: '提示',
    content: '模型训练过程中不可暂停，是否确定开始？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      d.loading = true
      try {
        await taskTrain({
          modelID: row.modelID
        })
        message.success('任务已开始')
      } catch (err: any) {
        message.error(err.messages)
      }
    }
  })
}

const viewTaskResult = async (row: TableData) => {
  selectedTask.value = row
  globalStateStoreStore.taskResultModalVisible = true
}

const actionButtonRender = (row: TableData) => {
  if (!props.isMytaskList) {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        onClick: () => taskAccept(row)
      },
      {
        default: () => '接收任务'
      }
    )
  }

  if (row.state === 'ASSIGNED') {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        disabled: !row.isAssigner,
        onClick: () => startTrain(row)
      },
      {
        default: () => '开始任务'
      }
    )
  }

  if (row.state === 'TRAINED') {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        disabled: true,
        onClick: () => startTrain(row)
      },
      {
        default: () => '正在训练'
      }
    )
  }
  return h(
    NButton,
    {
      size: 'small',
      type: 'error',
      tertiary: true,
      disabled: row.state !== 'FINISHED',
      onClick: () => viewTaskResult(row)
    },
    {
      default: () => '查看结果'
    }
  )
}

const tableColumns: DataTableColumns<TableData> = [
  {
    title: AliasCN.taskName,
    key: 'taskName',
    align: 'center'
  },
  {
    title: AliasCN.assignDateTime,
    key: 'assignDateTime',
    align: 'center',
    render: (row: FLearningModels.Task) =>
      dayjs(row.assignDateTime).format('YYYY-MM-DD HH:MM')
  },
  {
    title: '当前/最少参与方',
    key: 'peersRatio',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          size: 'small'
        },
        { default: () => `${row.currentPeers}/${row.minPeers}` }
      )
    }
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
          size: 'small'
        },
        { default: () => AliasCN[row.state].text }
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            style: {
              marginRight: '10px'
            },
            size: 'small',
            type: 'info',
            tertiary: true,
            onClick: () => viewDetail(row)
          },
          { default: () => '查看详情' }
        ),
        actionButtonRender(row)
      ]
    }
  }
]
</script>
