<template>
  <el-dialog
    v-model="layoutStore.taskAcceptDialogVisible"
    title="接收任务"
    width="25%"
  >
    <el-form
      class="task-assign-form"
      label-position="right"
      label-width="110px"
    >
      <el-form-item :label="AliasCN['trainFile']">
        <el-upload
          action=""
          with-credentials
          :auto-upload="false"
          :on-change="handleTrainFileChange"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            <em>点击上传训练数据文件</em>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item :label="AliasCN['evaluateFile']">
        <el-upload
          action=""
          with-credentials
          :auto-upload="false"
          :on-change="handleEvaluateFileChange"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            <em>点击上传测试数据文件</em>
          </div>
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
          @click="layoutStore.taskAcceptDialogVisible = false"
        >
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import { AliasCN } from '@/constants'
import { taskAccept } from '@/api/fLearning'
import useLayoutStore from '@/store/modules/layout'
import { ElNotification, UploadFile, UploadRawFile } from 'element-plus'

const props = defineProps<{ modelId: string }>()

const layoutStore = useLayoutStore()

let uploadTrainFile: UploadRawFile
let uploadEvaluateFile: UploadRawFile

const handleTrainFileChange = (uploadFile: UploadFile) => {
  console.log('uploadFile', uploadFile)
  if (uploadFile.raw) {
    uploadTrainFile = uploadFile.raw
  }
}

const handleEvaluateFileChange = (uploadFile: UploadFile) => {
  console.log('uploadFile', uploadFile)
  if (uploadFile.raw) {
    uploadEvaluateFile = uploadFile.raw
  }
}

// 任务接收（accept）
const submitAccept = async () => {
  const taskAcceptParams: FLearningAPI.TaskAcceptParams = {
    modelID: props.modelId,
    trainFile: uploadTrainFile,
    evaluateFile: uploadEvaluateFile,
  }
  try {
    await taskAccept(taskAcceptParams)
    ElNotification.success('任务接收成功！')
  } catch (err: any) {
    ElNotification.error(err)
  }
  layoutStore.taskAcceptDialogVisible = false
}
</script>

<script lang="ts">
export default {
  name: 'TaskAcceptDialog',
}
</script>
