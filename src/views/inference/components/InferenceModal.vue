<template>
  <n-modal
    v-model:show="globalStateStore.inferenceModalVisible"
    preset="card"
    title="模型推理"
    style="min-height: 100vh; padding: 30px; margin: auto"
  >
    <n-space align="center">
      <div>任务: {{ model.taskName }}</div>
      <br />
      <div>模型ID: {{ model.modelID }}</div>
      <br />
      <n-button text type="success" @click="downloadModel(model.modelID)">
        下载模型
      </n-button>
    </n-space>

    <n-divider />

    <n-space justify="end" style="margin-bottom: 10px">
      <n-upload
        ref="upload"
        :show-file-list="false"
        style="float: right"
        @update:file-list="onInferenceFileChange"
      >
        <n-button secondary type="error">选择文件并开始推理</n-button>
      </n-upload>
    </n-space>

    <n-grid x-gap="0" y-gap="24" cols="4" class="history-box">
      <n-gi span="1" class="history-nav">
        <div
          v-for="history in inferenceHistoryList"
          :key="history.inferenceDateTime"
          class="history-nav-item"
          :class="history === selectedHistory ? 'active-history-item' : ''"
          @click="onSelectHistory(history)"
        >
          <div>{{ history.inferenceFile.filename }}</div>
          <div style="color: darkgray; font-size: small">
            {{ history.inferenceDateTime }}
          </div>
        </div>
      </n-gi>
      <n-gi span="3" class="history-content">
        <n-space justify="end" align="center" style="margin-bottom: 10px">
          <n-button type="info" text @click="downloadInferenceFile">
            下载推理文件（{{ selectedHistory?.inferenceFile.filename }}）
          </n-button>
          <n-button type="info" text @click="downloadInferenceResult">
            下载推理结果
          </n-button>
        </n-space>
        <n-data-table
          :columns="tableColumns"
          :data="tableData"
          virtual-scroll
          striped
          :max-height="600"
        />
      </n-gi>
    </n-grid>
  </n-modal>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchEffect } from 'vue'
import useGlobalStateStore from '@/store/modules/globalState'
import { NButton, useDialog, useMessage } from 'naive-ui'
import type { UploadInst, UploadFileInfo } from 'naive-ui'
import { fetchInferenceHistoryList, modelInference } from '@/api/fLearning'

const dialog = useDialog()
const message = useMessage()
const globalStateStore = useGlobalStateStore()
const props = defineProps<{ model: FLearningModels.Model }>()

const downloadModel = (modelID: string) => {
  // TODO: 下载模型
  console.log('点击了下载模型，modelID：', modelID)
}

const inferenceHistoryList = ref<FLearningModels.InferenceHistory[]>()
const selectedHistory = ref<FLearningModels.InferenceHistory>()
onBeforeMount(async () => {
  inferenceHistoryList.value = await fetchInferenceHistoryList(
    props.model.modelID
  )
  // eslint-disable-next-line prefer-destructuring
  selectedHistory.value = inferenceHistoryList.value[0]
})

const onSelectHistory = (history: FLearningModels.InferenceHistory) =>
  (selectedHistory.value = history)

let inferenceFile: File

const onInferenceFileChange = (fileList: UploadFileInfo[]) => {
  inferenceFile = fileList[0].file as File

  dialog.success({
    title: '确认操作',
    content: '点击确定后将上传文件进行推理，是否确认此次操作？',
    positiveText: '确定',
    negativeText: '不确定',
    onMaskClick: () => {
      message.info('已取消')
    },
    onNegativeClick: () => {
      message.info('已取消')
    },
    onPositiveClick: () => {
      message.success('已上传文件并开始进行推理，稍后可通过该页面查看结果')
      modelInference({
        modelID: props.model.modelID,
        inferenceFile,
      })
    },
  })
}

const tableColumns = ref()
const tableData = ref()
watchEffect(() => {
  tableColumns.value = Object.keys(
    selectedHistory.value?.result.content[0]
  ).map((item) => ({
    title: item,
    key: item,
    align: 'center',
  }))
  tableData.value = selectedHistory.value?.result.content
})

const downloadInferenceFile = async () => {
  window.open(selectedHistory.value?.inferenceFile.url)
}
const downloadInferenceResult = async () => {
  window.open(selectedHistory.value?.result.url)
}
</script>

<style scoped lang="scss">
.history-box {
  border: 1px solid #36ad6a;
  border-radius: 10px;
  overflow: hidden;
  .history-nav {
    .history-nav-item {
      border-radius: 2%;
      padding: 12px 12px 12px 25px;
      &:hover {
        color: green;
        cursor: pointer;
      }
    }
  }
  .active-history-item {
    background: rgb(231, 245, 238);
    color: green;
    &:hover {
      color: black;
    }
  }

  .history-content {
    padding: 20px;
  }
}
</style>
