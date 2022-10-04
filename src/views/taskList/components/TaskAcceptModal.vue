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
        action="xxx"
        filename="训练数据"
        tip="提示：文件只支持 CSV 格式"
      />

      <UploadDragger
        action="xxx"
        filename="测试数据"
        tip="提示：文件只支持 CSV 格式"
      />
    </n-space>
  </n-modal>
</template>

<script setup lang="ts">
import { taskAccept } from '@/api/fLearning'
import useGlobalStateStore from '@/store/modules/globalState'
import { createLoading } from '@/utils/style'
import { useMessage } from 'naive-ui'
import UploadDragger from '@/components/upload/UploadDragger.vue'

const message = useMessage()
const globalStateStore = useGlobalStateStore()
const props = defineProps<{ task: FLearningModels.Task }>()

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
