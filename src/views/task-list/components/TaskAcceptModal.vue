<template>
  <n-modal
    v-model:show="globalStateStore.taskAcceptModalVisible"
    preset="dialog"
    title="接收任务"
    positive-text="确认接收"
    type="success"
    :positive-button-props="{ type: 'error' }"
    @positive-click="handleAccept"
  >
    <n-space>
      <UploadDragger filename="训练数据" :on-file-change="onTrainFileChange" />

      <UploadDragger
        filename="测试数据"
        :on-file-change="onEvaluateFileChange"
      />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { taskAccept } from '@/api/fLearning'
import useGlobalStateStore from '@/store/modules/globalState'
import { createLoading } from '@/utils/style'
import { UploadFileInfo, useMessage } from 'naive-ui'
import UploadDragger from '@/components/upload/UploadDragger.vue'
import useModelSettings from '@/store/modules/modelSettings'

const modelSettings = useModelSettings()
const message = useMessage()
const globalStateStore = useGlobalStateStore()
const props = defineProps<{ task: FLearningModels.Task }>()

let trainFile: any
let evaluateFile: any

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  trainFile = fileList[0].file
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  evaluateFile = fileList[0].file
}
const handleAccept = async () => {
  const taskAcceptParams: FLearningModels.TaskAcceptParams = {
    modelID: props.task.modelID,
    trainFile,
    evaluateFile,
  }

  try {
    const loading = createLoading('正在上传训练文件...')
    await taskAccept(taskAcceptParams)
    loading.close()
    message.info('正在接收任务，请稍等...', {
      duration: 10000,
      closable: true,
    })
  } catch (err: any) {
    message.error(err.message)
  }

  globalStateStore.taskAcceptModalVisible = false
}
</script>
