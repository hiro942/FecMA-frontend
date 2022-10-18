<template>
  <div v-if="props.tasks" id="task-list">
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
          <n-icon :component="FilterOutline" />
        </template>
      </n-select>

      <n-input v-model:value="searchText" placeholder="按任务名搜索">
        <template #prefix>
          <n-icon :component="SearchOutline" />
        </template>
      </n-input>

      <n-button
        secondary
        strong
        type="error"
        @click="() => router.push({ name: 'TaskAssign' })"
      >
        <template #icon>
          <n-icon :component="AddOutline"></n-icon>
        </template>
        创建新任务
      </n-button>
    </n-space>

    <n-data-table
      :bordered="false"
      :single-line="false"
      :columns="
        props.isMytaskList
          ? tableColumns
          : tableColumns.filter((column: any) => column.key !== 'state')
      "
      :data="filteredTasks"
      :pagination="{ pageSize: 15 }"
    />

    <TaskDetail
      v-if="globalStateStore.taskDetailModalVisible"
      :task="selectedTask"
    />

    <TaskAccept
      v-if="globalStateStore.taskAcceptModalVisible"
      :task="selectedTask"
    />

    <TaskResult
      v-if="globalStateStore.taskResultModalVisible"
      :task="selectedTask"
      :model-info="selectedTaskModel"
    />
  </div>
</template>

<script lang="ts" setup>
import TaskDetail from '@/views/task-list/components/TaskDetailModal.vue'
import TaskAccept from '@/views/task-list/components/TaskAcceptModal.vue'
import TaskResult from '@/views/task-list/components/TaskResultModal/TaskResultModal.vue'
import { AddOutline, SearchOutline, FilterOutline } from '@vicons/ionicons5'
import { taskTrain } from '@/api/fLearning'
import {
  computed,
  ref,
  onBeforeMount,
  onBeforeUnmount,
  h,
  onActivated,
} from 'vue'
import { AliasCN } from '@/constants/alias'
import type { DataTableColumns } from 'naive-ui'
import { NTag, NButton, useMessage, useDialog } from 'naive-ui'
import { useRouter } from 'vue-router'
import useGlobalStateStore from '@/store/modules/globalState'

const router = useRouter()
const message = useMessage()
const dialog = useDialog()

const props = defineProps<{
  tasks: FLearningModels.Task[]
  isMytaskList: boolean
}>()

console.log('收到的task为:', props.tasks)

const globalStateStore = useGlobalStateStore()

const stateFilterOptions = [
  { value: 'ASSIGNED', label: '待开始' },
  { value: 'TRAINED', label: '进行中' },
  { value: 'FINISHED', label: '已完成' },
]

const searchText = ref('') // 搜索关键词
const selectedState = ref<null | string>() // 选择查看的任务状态
const onlyShowMyAssigned = ref(false) // 只显示我创建的任务

const getInitState = () => {
  // 获取可能存在的筛选条件（eg: 从 dashboard 点击跳转）
  searchText.value = globalStateStore.searchTaskName
  selectedState.value =
    globalStateStore.filterTaskState === ''
      ? null
      : globalStateStore.filterTaskState
}

onActivated(() => {
  getInitState()
})

onBeforeMount(() => {
  getInitState()
})

onBeforeUnmount(() => {
  // 组件卸载前清空筛选条件
  globalStateStore.searchTaskName = ''
  globalStateStore.filterTaskState = ''
})

type TableData = FLearningModels.Task

const selectedTask = ref() // 选择的任务
const selectedTaskModel = ref() // 选择的任务模型

// 根据任务名过滤后的数据
const filteredTasks = computed(() =>
  props.tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchText.value.toLowerCase()) &&
      (task.state === selectedState.value || selectedState.value === null) &&
      (!onlyShowMyAssigned.value || task.isAssigner === 1)
  )
)

const viewDetail = (row: TableData) => {
  selectedTask.value = row
  globalStateStore.taskDetailModalVisible = true
}

const taskAccept = (row: TableData) => {
  selectedTask.value = row
  globalStateStore.taskAcceptModalVisible = true
}

const startTrain = (row: TableData) => {
  dialog.info({
    title: '提示',
    content: '模型训练过程中不可暂停，是否确定开始？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await taskTrain({
          modelID: row.modelID,
        })
        message.success('任务已开始')
      } catch (err: any) {
        message.error(err.messages)
      }
    },
  })
}

const viewTaskResult = async (row: TableData) => {
  selectedTask.value = row
  // selectedTaskModel.value = await fetchModel(task.modelID)
  globalStateStore.taskResultModalVisible = true
}

const actionButtonRender = (row: TableData) => {
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
        onClick: () => startTrain(row),
      },
      {
        default: () => '开始任务',
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
      onClick: () => viewTaskResult(row),
    },
    {
      default: () => '查看结果',
    }
  )
}

const showStateColumn = () => {
  if (props.isMytaskList) {
    return {
      title: AliasCN.state,
      key: 'state',
      align: 'center',
      render(row: TableData) {
        return h(
          NTag,
          {
            type: AliasCN[row.state].type,
            size: 'small',
          },
          { default: () => AliasCN[row.state].text }
        )
      },
    }
  }
  return {}
}

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
