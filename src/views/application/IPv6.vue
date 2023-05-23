<template>
  <div>
    <n-card class="mb-2.5">
      <n-h4>发布任务</n-h4>
      <n-form
        ref="formRef"
        inline
        :model="modelSettingsStore.commonSettings"
        :rules="undefined"
        size="small"
      >
        <n-form-item :label="AliasCN.taskName" path="taskName">
          <n-input
            v-model:value="modelSettingsStore.commonSettings.taskName"
            placeholder=""
          />
        </n-form-item>
        <!--        <n-form-item :label="AliasCN.minPeers" path="minPeers">-->
        <!--          <n-input-number-->
        <!--            v-model:value="settings.minPeers"-->
        <!--            :precision="0"-->
        <!--            :min="1"-->
        <!--          />-->
        <!--        </n-form-item>-->
        <n-form-item>
          <n-upload :max="1" @update:file-list="onTrainFileChange">
            <n-button size="small">训练集</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item>
          <n-upload :max="1" @update:file-list="onEvaluateFileChange">
            <n-button size="small">验证集</n-button>
          </n-upload>
        </n-form-item>
        <n-form-item>
          <n-button
            :loading="styleStore.showLoading"
            secondary
            strong
            type="error"
            @click="handleTaskAssign"
          >
            创建任务
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>

    <n-card class="mb-2.5">
      <n-h4>已参与任务</n-h4>
      <n-data-table
        size="small"
        :columns="tasksJoined.length ? myTaskTableColumns : []"
        :data="tasksJoined"
        :pagination="tasksJoined.length > 5 ? { pageSize: 5 } : undefined"
      >
        <template #empty> 暂无参与任务</template>
      </n-data-table>
    </n-card>

    <n-card class="mb-2.5">
      <n-h4>可接收任务</n-h4>
      <n-data-table
        size="small"
        :columns="tasksCanAccept.length ? allTaskTableColumns : []"
        :data="tasksCanAccept"
        :pagination="tasksCanAccept.length > 5 ? { pageSize: 5 } : undefined"
      >
        <template #empty> 暂无可接收任务</template>
      </n-data-table>
    </n-card>

    <n-card class="mb-2.5">
      <n-h4>推理</n-h4>
      <n-data-table
        size="small"
        :columns="models.length ? modelTableColumns : []"
        :data="models"
        :pagination="models.length > 5 ? { pageSize: 5 } : undefined"
      >
        <template #empty> 暂无可用模型</template>
      </n-data-table>
    </n-card>

    <TaskDetail
      v-if="globalStateStoreStore.taskDetailModalVisible"
      :task-detail="taskDetail"
    />

    <TaskAccept
      v-if="globalStateStoreStore.taskAcceptModalVisible"
      :task-detail="taskDetail"
    />

    <TaskResult
      v-if="globalStateStoreStore.taskResultModalVisible"
      :task="selectedTask"
      :metric-data="taskMetric"
      :metric-data-all="taskMetricAll"
    />

    <InferenceModal
      v-if="globalStateStoreStore.inferenceModalVisible"
      :task-type="'ipv6'"
      :task="selectedTask"
      :inference-history-list="inferenceHistoryList"
    />
  </div>
</template>

<script setup lang="ts">
import TaskDetail from '@/views/task-list/TaskDetailModal.vue'
import TaskAccept from '@/views/task-list/TaskAcceptModal.vue'
import TaskResult from '@/views/task-list/TaskResultModal.vue'
import { h, ref, toRaw } from 'vue'
import { AliasCN } from '@/configs/maps'
import useGlobalStateStore from '@/store/globalState'
import {
  DataTableColumns,
  FormInst,
  NButton,
  NUpload,
  UploadFileInfo,
  useDialog,
  useMessage,
  useNotification,
} from 'naive-ui'
import {
  fetchAllTask,
  fetchInferenceHistoryList,
  fetchModelList,
  fetchModelMetric,
  fetchModelMetricAll,
  fetchMyTask,
  fetchTaskDetail,
  taskAssign,
  taskTrain,
} from '@/api/fLearning'
import useStyleStore from '@/store/style'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import useModelSettingsStore from '@/store/modelSettings'
import { ipv6TaskFilter } from '@/utils/filters'
import InferenceModal from '@/views/inference/InferenceModal.vue'

const styleStore = useStyleStore()
const modelSettingsStore = useModelSettingsStore()
const formRef = ref<FormInst | null>(null)
const globalStateStore = useGlobalStateStore()

const tasksJoined = ref<FLearningModels.Task[]>([])
const tasksCanAccept = ref<FLearningModels.Task[]>([])
const models = ref<FLearningModels.Task[]>([])
const router = useRouter()
const message = useMessage()
const notification = useNotification()
const dialog = useDialog()
const globalStateStoreStore = useGlobalStateStore()

const taskDetail = ref()
const taskMetric = ref()
const taskMetricAll = ref()
const selectedTask = ref()
const inferenceHistoryList = ref()

onBeforeMount(() => {
  fetchMyTask().then(
    (value) => {
      tasksJoined.value = ipv6TaskFilter(value)
    },
    (reason) => {
      message.error('获取已参与任务时发生错误')
    }
  )
  fetchAllTask().then(
    (value) => {
      tasksCanAccept.value = ipv6TaskFilter(value)
    },
    (reason) => {
      message.error('获取可接收任务时发生错误')
    }
  )
  fetchModelList().then(
    (value) => {
      models.value = ipv6TaskFilter(value)
    },
    (reason) => {
      message.error('获取模型列表时发生错误')
    }
  )
})

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettingsStore.dataset.trainFile = undefined
    return
  }
  modelSettingsStore.dataset.trainFile = fileList[0].file
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettingsStore.dataset.evaluateFile = undefined
    return
  }
  modelSettingsStore.dataset.evaluateFile = fileList[0].file
}

const handleTaskAssign = async () => {
  const { commonSettings, dataset, csvDatasetSettings, lstmSettings } =
    modelSettingsStore
  // 构造提交参数
  const taskAssignParams: any = {
    ...commonSettings,
    taskName: commonSettings.taskName + '$ipv6$',
    timeLimit: 9999999,
    description: 'IPv6地址推断任务',
    ...dataset,
    modelParam: JSON.stringify(toRaw(lstmSettings)),
    featureParam: '{}',
  }
  Object.assign(taskAssignParams, {
    labelName: 'y',
  })
  Object.assign(taskAssignParams, {
    featureNames: JSON.stringify(csvDatasetSettings.featureNames),
  })
  try {
    // 创建
    await taskAssign(taskAssignParams)
    notification.info({
      title: '任务发布中...',
      content: '稍后可在「我的任务」页面进行查看',
      duration: 60000,
    })
  } catch (err: any) {
    message.error(err.message)
  }
}

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
    taskMetric.value = await fetchModelMetric(row.modelID)
    // TODO 这个是JSON，要解析
    taskMetric.value = JSON.parse(taskMetric.value)

    console.log(taskMetric.value)

    if (row.modelName === 'homo_lr') {
      taskMetric.value.data.lossHistory = taskMetric.value.data.lossHistory.map(
        (item: number, index: number) => [index, item]
      )
    }
    taskMetricAll.value = await fetchModelMetricAll(row.modelID)
    console.log(taskMetricAll.value)

    // TODO 这不是个JSON，不用解析
    // taskMetricAll.value = JSON.parse(taskMetricAll.value)
    selectedTask.value = row
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
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } catch (err: any) {
        message.error(err.messages)
      }
    },
  })
}

const myTaskTableColumns: DataTableColumns<FLearningModels.Task> = [
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
    title: '',
    key: 'actions',
    render(row) {
      return [actionButtonRender(row)]
    },
  },
]

const actionButtonRender = (row: FLearningModels.Task) => {
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

const allTaskTableColumns: DataTableColumns<FLearningModels.Task> = [
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
    title: '',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            tertiary: true,
            onClick: () => taskAccept(row),
          },
          { default: () => '接收' }
        ),
      ]
    },
  },
]

const modelTableColumns: DataTableColumns<FLearningModels.Task> = [
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
    title: '',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          size: 'small',
          type: 'info',
          tertiary: true,
          onClick: () => openModelInferenceModal(row),
        },
        { default: () => '推理' }
      )
    },
  },
]

const openModelInferenceModal = async (row: FLearningModels.Task) => {
  selectedTask.value = row
  try {
    inferenceHistoryList.value = await fetchInferenceHistoryList(row.modelID)
  } catch (err: any) {
    message.error(err.message)
  }
  globalStateStore.inferenceModalVisible = true
}
</script>