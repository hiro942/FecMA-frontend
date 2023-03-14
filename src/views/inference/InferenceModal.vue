<template>
  <n-modal
    v-if='inferenceHistoryList'
    v-model:show='globalStateStoreStore.inferenceModalVisible'
    preset='card'
    title='模型推理'
    style='min-height: 100vh; padding: 30px; margin: auto'
  >
    <n-descriptions
      label-placement='left'
      :column='1'
      bordered
      label-style='width: 130px'
    >
      <n-descriptions-item :label='AliasCN.taskName'>
        {{ model.taskName }}
      </n-descriptions-item>
      <n-descriptions-item :label='AliasCN.modelID'>
        {{ model.modelID }}
      </n-descriptions-item>
      <n-descriptions-item label='操作'>
        <n-button text type='info' @click='downloadModel(model.modelID)'>
          下载模型
        </n-button>
      </n-descriptions-item>
    </n-descriptions>

    <n-divider />

    <n-steps :current="(current as number)" :status="currentStatus">
      <n-step
        title="数据上传"
        description="将需要推理的文件上传至服务器"
      />
      <n-step
        title="模型推理"
        description="推理中，请稍后..."
      />
      <n-step
        title="推理完成"
        description="推理完成，点击下方按钮下载推理结果"
      >
        <n-button :disabled='current !== 3'>下载推理结果</n-button>
      </n-step>
    </n-steps>

<!--    <n-space justify='space-between'>-->
<!--      <n-h4>推理结果</n-h4>-->
<!--      <n-upload-->
<!--        ref='upload'-->
<!--        :show-file-list='false'-->
<!--        style='float: right'-->
<!--        @update:file-list='onInferenceFileChange'-->
<!--      >-->
<!--        <n-button secondary type='error'> 选择文件并开始推理</n-button>-->
<!--      </n-upload>-->
<!--    </n-space>-->

<!--    <n-card>-->
<!--      &lt;!&ndash;    栅格布局，左边是导航，右边是内容&ndash;&gt;-->
<!--      <n-grid-->
<!--        v-if='inferenceHistoryList'-->
<!--        class='overflow-hidden'-->
<!--        x-gap='0'-->
<!--        y-gap='24'-->
<!--        cols='4'-->
<!--      >-->
<!--        <n-gi span='1' class='history-nav'>-->
<!--          <div-->
<!--            v-for='history in inferenceHistoryList'-->
<!--            :key='history.inferenceDateTime'-->
<!--            class='hover:cursor-pointer hover:text-green-500 rounded padding: p-[12px]'-->
<!--            :class="history === selectedHistory ? 'active-history-item' : ''"-->
<!--            @click='onSelectHistory(history)'-->
<!--          >-->
<!--            <div>{{ history.inferenceFile.filename }}</div>-->
<!--            <div style='color: darkgray; font-size: small'>-->
<!--              {{ history.inferenceDateTime }}-->
<!--            </div>-->
<!--          </div>-->
<!--        </n-gi>-->
<!--        <n-gi span='3' class='p-[20px]'>-->
<!--          <n-space justify='start' align='center' class='mb-3'>-->
<!--            <n-button-->
<!--              text-->
<!--              type='info'-->
<!--              @click='downloadInferenceFile'-->
<!--              class='mr-5'-->
<!--            >-->
<!--              下载推理文件（{{ selectedHistory?.inferenceFile.filename }}）-->
<!--            </n-button>-->
<!--            <n-button text type='info' @click='downloadInferenceResult'>-->
<!--              下载推理结果-->
<!--            </n-button>-->
<!--          </n-space>-->
<!--          <n-data-table-->
<!--            :columns='tableColumns'-->
<!--            :data='tableData'-->
<!--            virtual-scroll-->
<!--            striped-->
<!--            :max-height='600'-->
<!--          />-->
<!--        </n-gi>-->
<!--      </n-grid>-->
<!--      <n-empty-->
<!--        v-if='inferenceHistoryList && !inferenceHistoryList.length'-->
<!--        description='暂无推理历史'-->
<!--      />-->
<!--    </n-card>-->
  </n-modal>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue'
import useGlobalStateStore from '@/store/globalState'
import type { UploadFileInfo } from 'naive-ui'
import { NButton, useDialog, useMessage } from 'naive-ui'
import { fetchInferenceHistoryList, modelInference } from '@/api/fLearning'
import { AliasCN } from '@/configs/maps'
import { StepsProps } from 'naive-ui'

const dialog = useDialog()
const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()
const props = defineProps<{ model: FLearningModels.Model }>()

const current = ref<number | null>(1)
const currentStatus =  ref<StepsProps['status']>('process')

const downloadModel = (modelID: string) => {
  // TODO: 下载模型
  message.info(`'点击了下载模型，modelID：${modelID}`)
}

const inferenceHistoryList = ref<FLearningModels.InferenceHistory[]>()
const selectedHistory = ref<FLearningModels.InferenceHistory>()
onBeforeMount(async () => {
  try {
    inferenceHistoryList.value = await fetchInferenceHistoryList(
      props.model.modelID
    )
  } catch (err: any) {
    message.error(err.message)
  }

  if (inferenceHistoryList.value?.length) {
    selectedHistory.value = inferenceHistoryList.value[0]
  }
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
        inferenceFile
      })
    }
  })
}

const tableColumns = ref()
const tableData = ref()
watch(selectedHistory, () => {
  tableColumns.value = Object.keys(
    selectedHistory.value?.result.content[0]
  ).map((item) => ({
    title: item,
    key: item,
    align: 'center'
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
