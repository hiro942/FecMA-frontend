<template>
  <n-modal
    v-model:show="globalStateStoreStore.taskAcceptModalVisible"
    preset="dialog"
    title="接收任务"
    positive-text="确认接收"
    type="success"
    :positive-button-props="{ type: 'info' }"
    @positive-click="handleAccept"
  >
    <!--    TODO 根据任务数据类型做适配-->
    <n-space>
      <UploadDragger
        filetype="text/csv"
        filename="训练数据"
        :on-file-change="onTrainFileChange"
      />

      <UploadDragger
        filetype="text/csv"
        filename="测试数据"
        :on-file-change="onEvaluateFileChange"
      />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { taskAccept } from '@/api/fLearning'
import useGlobalStateStore from '@/store/globalState'
import { UploadFileInfo, useMessage, useNotification } from 'naive-ui'
import UploadDragger from '@/components/upload/UploadDragger.vue'

const notification = useNotification()
const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()
const props = defineProps<{ task: FLearningModels.Task }>()

let trainFile: any
let evaluateFile: any

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    trainFile = undefined
    return
  }
  trainFile = fileList[0].file
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    evaluateFile = undefined
    return
  }
  evaluateFile = fileList[0].file
}

const handleAccept = async () => {
  if (!trainFile || !evaluateFile) {
    message.error('请上传数据集')
    return false
  }

  const taskAcceptParams: FLearningModels.TaskAcceptParams = {
    modelID: props.task.modelID,
    trainFile,
    evaluateFile,
  }

  try {
    await taskAccept(taskAcceptParams)
    notification.info({
      content: '正在接收任务，请稍等...',
      duration: 10000,
    })
  } catch (err: any) {
    message.error(err.message)
  }

  globalStateStoreStore.taskAcceptModalVisible = false
}
</script>
