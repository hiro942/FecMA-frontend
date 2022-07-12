<template>
  <el-dialog
    v-model="globalStateStore.taskAcceptDialogVisible"
    title="接收任务"
    width="60%"
  >
    <el-form class="task-assign-form" label-position="top" label-width="110px">
      <el-form-item :label="AliasCN['trainFile']">
        <el-upload
          class="input-element"
          action=""
          with-credentials
          :auto-upload="false"
          :on-change="handleTrainFileChange"
          drag
        >
          <upload-content />
        </el-upload>
      </el-form-item>

      <el-form-item :label="AliasCN['evaluateFile']">
        <el-upload
          class="input-element"
          action=""
          with-credentials
          :auto-upload="false"
          :on-change="handleEvaluateFileChange"
          drag
        >
          <upload-content />
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-popconfirm
          title="是否确认接收此任务？"
          confirm-button-text="确认"
          cancel-button-text="取消"
          @confirm="submitAccept"
        >
          <template #reference>
            <el-button type="primary"> 确认接收 </el-button>
          </template>
        </el-popconfirm>
        <el-button
          type="danger"
          @click="globalStateStore.taskAcceptDialogVisible = false"
        >
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import UploadContent from '@/components/upload/UploadContent.vue'
import { AliasCN } from '@/constants'
import { taskAccept } from '@/api/fLearning'
import useGlobalStateStore from '@/store/modules/globalState'
import { ElNotification, UploadFile, UploadRawFile } from 'element-plus'
import { createLoading } from '@/utils/style'
import useUpload from '@/hooks/useUpload'

const props = defineProps<{ modelId: string }>()

const globalStateStore = useGlobalStateStore()

const {
  uploadTrainFile,
  uploadEvaluateFile,
  handleTrainFileChange,
  handleEvaluateFileChange,
} = useUpload()

// 任务接收（accept）
const submitAccept = async () => {
  const taskAcceptParams: FLearningAPI.TaskAcceptParams = {
    modelID: props.modelId,
    trainFile: uploadTrainFile.value,
    evaluateFile: uploadEvaluateFile.value,
  }
  const loading = createLoading('正在接收任务，请耐心等待...')
  try {
    await taskAccept(taskAcceptParams)
    ElNotification.success('任务接收成功')
  } catch (err: any) {
    ElNotification.error('任务接收失败')
  }
  loading.close()
  globalStateStore.taskAcceptDialogVisible = false
}
</script>

<script lang="ts">
export default {
  name: 'TaskAcceptDialog',
}
</script>

<style scoped lang="scss">
.task-assign-form {
  display: flex;
  justify-content: space-evenly;
}
</style>
