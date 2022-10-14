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
      <UploadDragger
        filename="训练数据"
        tip="提示：文件只支持 CSV 格式, 数据id置于第一列，标签置于第二列(若存在)"
        :on-file-change="onTrainFileChange"
      />

      <UploadDragger
        filename="测试数据"
        tip="提示：文件只支持 CSV 格式, 数据id置于第一列，标签置于第二列(若存在)"
        :on-file-change="onEvaluateFileChange"
      />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { taskAccept } from '@/api/fLearning'
import useGlobalStateStore from '@/store/modules/globalState'
import { createLoading } from '@/utils/style'
import { useMessage, UploadFileInfo } from 'naive-ui'
import UploadDragger from '@/components/upload/UploadDragger.vue'

const message = useMessage()
const globalStateStore = useGlobalStateStore()
const props = defineProps<{ task: FLearningModels.Task }>()

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  const selectedFile = fileList[0]?.file
  console.log('选择文件', selectedFile)
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  const selectedFile = fileList[0]?.file
  console.log('选择文件', selectedFile)
}
const handleAccept = async () => {
  const taskAcceptParams: FLearningModels.TaskAcceptParams = {
    modelID: props.task.modelID,
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
