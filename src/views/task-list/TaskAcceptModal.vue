<template>
  <n-modal
    :loading="styleStore.showLoading"
    v-model:show="globalStateStore.taskAcceptModalVisible"
    :auto-focus="false"
    preset="dialog"
    title="接收任务"
    positive-text="确认接收"
    :show-icon="false"
    :positive-button-props="{ type: 'info' }"
    @positive-click="handleAccept"
  >
      <n-alert v-if="taskDatasetType === 'csv'" type="warning" class="my-5">
        请上传CSV格式文件。文件中，数据ID请置于第一列，若存在数据标签，请置于第二列。
      </n-alert>
      <n-alert v-if="taskDatasetType === 'image'" type="warning" class="my-5">
        请以ZIP文件压缩包的形式上传。除图片外，压缩文件内还应包含一个记录图片标签的CSV文件。
        CSV文件共两列，表头为
        <strong>picture</strong> 的一列记录图片名称；表头为
        <strong>label</strong> 的一列记录图片标签值。
      </n-alert>
      <n-space justify="space-evenly" align="center">
        <UploadDragger
          :filetype="taskDatasetType"
          filename="训练数据"
          :on-file-change="onTrainFileChange"
        />
        <UploadDragger
          v-if="taskDetail.modelName !== 'homo_nn'"
          :filetype="taskDatasetType"
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
import useStyleStore from '@/store/style'

const styleStore = useStyleStore()
const notification = useNotification()
const message = useMessage()
const globalStateStore = useGlobalStateStore()
const props = defineProps<{ taskDetail: FLearningModels.TaskDetail }>()

const taskDatasetType = ref(
  Object.keys(props.taskDetail.uploadPictureParam as Object).length
    ? 'image'
    : 'csv'
)

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
    modelID: props.taskDetail.modelID,
    trainFile,
    evaluateFile,
  }

  try {
    message.info('正在上传数据文件...')
    await taskAccept(taskAcceptParams)
    notification.info({
      title: '接收任务中...',
      content: '稍后可在「我的任务」页面进行查看',
      duration: 10000,
    })
  } catch (err: any) {
    message.error(err.message)
  }

  globalStateStore.taskAcceptModalVisible = false
}
</script>