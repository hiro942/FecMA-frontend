<template>
  <n-space align="center" justify="end" style="padding-bottom: 10px">
    <n-checkbox
      v-if="props.isMytaskList"
      v-model:checked="onlyShowMyAssigned"
      size="large"
    >
      仅查看我创建的任务
    </n-checkbox>

    <n-select
      v-if="props.isMytaskList"
      v-model:value="selectedState"
      style="width: 180px"
      :options="stateFilterOptions"
      clearable
      placeholder="按任务状态筛选"
    >
      <template #arrow>
        <n-icon>
          <FilterOutline />
        </n-icon>
      </template>
    </n-select>

    <n-input v-model:value="searchText" placeholder="按任务名搜索">
      <template #prefix>
        <n-icon>
          <SearchOutline />
        </n-icon>
      </template>
    </n-input>

    <n-button
      secondary
      strong
      type="error"
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
    :single-line="false"
    :columns="
        isMytaskList
          ? tableColumns
          : tableColumns.filter((column: any) => column.key !== 'state')
      "
    :data="filteredTasks"
    :pagination="filteredTasks.length > 15 ? { pageSize: 15 } : false"
  >
    <template v-if="isMytaskList" #empty>暂无参与任务</template>
    <template v-else #empty> 暂无可接收任务</template>
  </n-data-table>

  <TaskDetailModal
    v-if="
      route.name === 'MyTask'
        ? isMytaskList && globalStateStoreStore.taskDetailModalVisible
        : !isMytaskList && globalStateStoreStore.taskDetailModalVisible
    "
    :task-detail="taskDetail"
  />

  <TaskAcceptModal
    v-if="globalStateStoreStore.taskAcceptModalVisible"
    :task-detail="taskDetail"
  />

  <TaskResultModal
    v-if="isMytaskList && globalStateStoreStore.taskResultModalVisible"
    :metric-data="taskMetric"
    :metric-data-all="taskMetricAll"
    :task="selectedTask"
  />
</template>

<script lang="ts" setup>
import TaskDetailModal from '@/views/task-list/TaskDetailModal.vue'
import TaskAcceptModal from '@/views/task-list/TaskAcceptModal.vue'
import TaskResultModal from '@/views/task-list/TaskResultModal.vue'
import { AddOutline, FilterOutline, SearchOutline } from '@vicons/ionicons5'
import {
  fetchModelMetric,
  fetchModelMetricAll,
  fetchTaskDetail,
  taskTrain,
} from '@/api/fLearning'
import { stateFilterOptions } from '@/configs/selectOptions'
import {
  computed,
  h,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  ref,
} from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTag, useDialog, useMessage, useNotification } from 'naive-ui'
import { useRoute, useRouter } from 'vue-router'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'

const route = useRoute()
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

const selectedTask = ref()
const taskDetail = ref()
const taskMetric = ref()
const taskMetricAll = ref()

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
const viewDetail = async (row: FLearningModels.Task) => {
  try {
    taskDetail.value = await fetchTaskDetail(row.modelID, row.partyID)
    globalStateStoreStore.taskDetailModalVisible = true
  } catch (err: any) {
    message.error(err.message)
  }
}

// 接收任务
const taskAccept = async (row: FLearningModels.Task) => {
  try {
    taskDetail.value = await fetchTaskDetail(row.modelID, row.partyID)
    globalStateStoreStore.taskAcceptModalVisible = true
  } catch (err: any) {
    message.error(err.message)
  }
}

// 查看任务结果
const viewTaskResult = async (row: FLearningModels.Task) => {
  try {
    selectedTask.value = row
    taskMetric.value = await fetchModelMetric(row.modelID)
    // TODO 这个是JSON，要解析
    taskMetric.value = JSON.parse(taskMetric.value)
    if (row.modelName === 'homo_lr') {
      taskMetric.value.data.lossHistory = taskMetric.value.data.lossHistory.map(
        (item: number, index: number) => [index, item]
      )
    }
    taskMetricAll.value = await fetchModelMetricAll(row.modelID)
    // TODO 这不是个JSON，不用解析
    // taskMetricAll.value = JSON.parse(taskMetricAll.value)
    console.log('@@@@@@@@@@@@@@@@')
    globalStateStoreStore.taskResultModalVisible = true
  } catch (err: any) {
    message.error(err.message)
  }
}

const startTrain = (row: FLearningModels.Task) => {
  if (row.currentPeers < 2) {
    notification.error({
      title: '参与方数量不足',
      content: `至少需要两个参与方加入任务`,
      duration: 3000,
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
          modelID: row.modelID,
        })
        notification.success({
          title: '任务已开始',
          content: '稍后可查看训练结果',
          duration: 5000,
        })
      } catch (err: any) {
        message.error(err.messages)
      }
    },
  })
}

const actionButtonRender = (row: FLearningModels.Task) => {
  if (!props.isMytaskList) {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        onClick: () => taskAccept(row),
      },
      {
        default: () => '接收任务',
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
        onClick() {
          startTrain(row)
        },
      },
      {
        default: () => '开始任务',
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
        onClick: () => startTrain(row),
      },
      {
        default: () => '正在训练',
      }
    )
  }
  if (row.state === 'FINISHED' && row.result === 'SUCCESS') {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        disabled: row.state !== 'FINISHED',
        onClick: () => viewTaskResult(row),
      },
      {
        default: () => '查看结果',
      }
    )
  }
  if (row.state === 'FINISHED' && row.result === 'ERROR') {
    return h(
      NButton,
      {
        size: 'small',
        type: 'error',
        tertiary: true,
        disabled: true,
        onClick: () => {
          message.error('该模型训练失败')
        },
      },
      {
        default: () => '训练失败',
      }
    )
  }
}

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
    render(row) {
      return dayjs(row.assignDateTime).format('YYYY-MM-DD HH:mm')
    },
  },
  {
    title: '当前参与方',
    key: 'currentPeers',
    align: 'center',
  },
  {
    title: AliasCN.state,
    key: 'state',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          type:
            row.state === 'FINISHED'
              ? AliasCN[row.state][row.result].type
              : AliasCN[row.state].type,
          size: 'small',
        },
        {
          default: () => {
            return row.state === 'FINISHED'
              ? AliasCN[row.state][row.result].text
              : AliasCN[row.state].text
          },
        }
      )
    },
  },
  {
    title: '',
    key: 'actions',
    align: 'center',
    render(row) {
      return [
        h(
          NButton,
          {
            style: {
              marginRight: '10px',
            },
            size: 'small',
            type: 'info',
            tertiary: true,
            onClick: () => viewDetail(row),
          },
          { default: () => '查看详情' }
        ),
        actionButtonRender(row),
      ]
    },
  },
]
</script>