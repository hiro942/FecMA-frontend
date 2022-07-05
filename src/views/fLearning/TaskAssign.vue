<template>
  <el-form
    class="task-assign-form"
    label-position="top"
    :model="formStateWithoutFiles"
    inline
  >
    <el-form-item :label="AliasCN['taskName']">
      <el-input v-model="formStateWithoutFiles.taskName" class="input-box" />
    </el-form-item>

    <el-form-item :label="AliasCN['modelName']">
      <el-select
        v-model="formStateWithoutFiles.modelName"
        class="input-box"
        placeholder="请选择模型"
      >
        <el-option
          v-for="item in modelOptions"
          :key="item.value"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="AliasCN['timeLimit']">
      <!--      <el-date-picker-->
      <!--          v-model="formState.timeLimit"-->
      <!--          type="datetime"-->
      <!--          placeholder="选择日期时间"-->
      <!--      />-->
      <el-input-number
        v-model="formStateWithoutFiles.timeLimit"
        class="input-box"
        :min="1"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['numberOfPeers']">
      <el-input-number
        v-model="formStateWithoutFiles.numberOfPeers"
        class="input-box"
        :min="1"
      />
    </el-form-item>

    <el-form-item :label="AliasCN['trainFile']">
      <el-upload
        class="input-box"
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
        class="input-box"
        action=""
        with-credentials
        :auto-upload="false"
        :on-change="handleEvaluateFileChange"
        drag
      >
        <upload-content />
      </el-upload>
    </el-form-item>

    <el-form-item :label="AliasCN['description']">
      <el-input
        v-model="formStateWithoutFiles.description"
        class="input-box text-area"
        type="textarea"
        placeholder="请输入关于该任务的任何描述性信息(如指定任务训练所需要的数据、参与任务的限制条件等)"
        :rows="5"
      />
    </el-form-item>

    <el-form-item>
      <el-button class="submit-btn" type="danger" @click="handleSubmit">
        创建任务
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import UploadContent from '@/components/upload/UploadContent.vue'
import { reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import { taskAssign } from '@/api/fLearning'
import { AliasCN } from '@/constants'
import { taskAssignFormValidator } from '@/utils/validators'
import { createLoading } from '@/utils/style'
import useUpload from '@/hooks/useUpload'

const modelOptions = [
  { key: 'HomoSecureboost', value: 'HomoSecureboost' },
  { key: 'model-2', value: 'model-2' },
  { key: 'model-3', value: 'model-3' },
]

const formStateWithoutFiles = reactive<
  Omit<FLearningAPI.TaskAssignParams, 'trainFile' | 'evaluateFile'>
>({
  taskName: '',
  modelName: '',
  numberOfPeers: 0,
  timeLimit: 0,
  partition: 0,
  description: '',
})

const {
  uploadTrainFile,
  uploadEvaluateFile,
  handleTrainFileChange,
  handleEvaluateFileChange,
} = useUpload()

// 创建任务
const handleSubmit = async () => {
  const taskAssignFormState: FLearningAPI.TaskAssignParams = {
    ...formStateWithoutFiles,
    trainFile: uploadTrainFile.value,
    evaluateFile: uploadEvaluateFile.value,
  }

  try {
    await taskAssignFormValidator(taskAssignFormState)
  } catch (err) {
    ElMessage.error((err as Error).message)
    return
  }

  const loading = createLoading('任务创建中，请耐心等待...')
  try {
    await taskAssign(taskAssignFormState)
    ElNotification.success('任务创建成功')
  } catch (err) {
    ElNotification.error('任务创建失败')
  }
  loading.close()
}
</script>

<style scoped lang="scss">
.task-assign-form {
  max-width: 800px;
  padding: 20px 50px;
  margin: 0 auto;

  .input-box {
    width: 300px;
    &.text-area {
      width: 632px;
    }
  }

  .submit-btn {
    width: 150px;
    height: 50px;
    margin-top: 20px;
  }
}
</style>
