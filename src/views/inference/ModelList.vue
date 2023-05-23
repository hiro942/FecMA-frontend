<template>
  <div>
    <n-card v-if="models">
      <n-grid
        x-gap="24"
        y-gap="24"
        cols="1 620:2 1000:3"
        style="max-width: 1080px"
      >
        <n-gi v-for="(model, index) in models" :key="index">
          <n-card
            embedded
            hoverable
            :bordered="false"
            :title="model.taskName"
            :segmented="{
              content: true,
              footer: 'soft',
            }"
          >
            <template #header-extra>ID: {{ model.modelID }}</template>
            <div>模型名称：{{ modelNamesMapCN[model.modelName] }}</div>
            <div>参与节点：{{ model.currentPeers }}</div>
            <!--            <div>准确率：{{ model.accuracy || '无' }}</div>-->
            <template #footer>
              <n-space justify="space-between" align="center">
                <div>
                  {{ dayjs(model.assignDateTime).format('YYYY-MM-DD HH:mm') }}
                </div>
                <n-space>
                  <n-button
                    size="small"
                    @click="openTaskResultModal(model)"
                  >
                    查看性能
                  </n-button>
                  <n-button
                    size="small"
                    @click="openModelInferenceModal(model)"
                  >
                    推理
                  </n-button>
                </n-space>
              </n-space>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
      <n-empty
        v-if="models && !models.length"
        class="mt-16"
        description="暂无可用模型"
      />
    </n-card>

    <TaskResultModal
      v-if="globalStateStoreStore.taskResultModalVisible"
      :task="selectedTask"
      :metric-data="taskMetric"
      :metric-data-all="taskMetricAll"
    />

    <InferenceModal
      v-if="globalStateStoreStore.inferenceModalVisible"
      :task-type="'normal'"
      :task="selectedTask"
      :inference-history-list="inferenceHistoryList"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {
  fetchInferenceHistoryList,
  fetchModelList,
  fetchModelMetric,
  fetchModelMetricAll,
} from '@/api/fLearning'
import useGlobalStateStore from '@/store/globalState'
import InferenceModal from '@/views/inference/InferenceModal.vue'
import { useMessage } from 'naive-ui'
import { modelNamesMapCN } from '@/configs/maps'
import dayjs from 'dayjs'
import { ipv6TaskFilter, normalTaskFilter } from '@/utils/filters'
import useStyleStore from '@/store/style'
import TaskResultModal from '@/views/task-list/TaskResultModal.vue'

const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

const models = ref<FLearningModels.Task[]>()
onBeforeMount(async () => {
  try {
    models.value = await fetchModelList()
    models.value = normalTaskFilter(models.value)
  } catch (err: any) {
    message.error(err.message)
  }
})

const selectedTask = ref()
const inferenceHistoryList = ref()
const taskMetric = ref()
const taskMetricAll = ref()

const openTaskResultModal = async (row: FLearningModels.Task) => {
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

const openModelInferenceModal = async (row: FLearningModels.Task) => {
  selectedTask.value = row
  try {
    inferenceHistoryList.value = await fetchInferenceHistoryList(row.modelID)
  } catch (err: any) {
    message.error(err.message)
  }
  globalStateStoreStore.inferenceModalVisible = true
}
</script>
