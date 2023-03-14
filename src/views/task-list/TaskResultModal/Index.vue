<template>
  <n-modal
    v-model:show='globalStateStoreStore.taskResultModalVisible'
    preset='dialog'
    :auto-focus='false'
    title='训练结果'
    type='success'
    style='width: 100vw; min-height: 100vh'
  >
    <Metrics :task='props.task' />
  </n-modal>
</template>

<script setup lang='ts'>
import useGlobalStateStore from '@/store/globalState'
import { useMessage } from 'naive-ui'
import Metrics from '@/views/task-list/TaskResultModal/Metrics.vue'

const props = defineProps<{ task: FLearningModels.Task }>()
const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

// 模型下载
// const handleDownloadModel = async () => {
//   try {
//     const data = await downloadModel(props.task.modelID)
//     message.success('操作成功，下载即将开始')
//     download(data, '模型结果.json')
//   } catch (err: any) {
//     message.error(err.message)
//   }
// }
</script>
