<template>
  <div class="task-assign-container">
    <el-form
      class="task-assign-form"
      label-position="left"
      label-width="110px"
      :model="formStateWithoutFiles"
    >
      <el-form-item :label="AliasCN['taskName']">
        <el-input v-model="formStateWithoutFiles.taskName" />
      </el-form-item>

      <el-form-item :label="AliasCN['description']">
        <el-input
          v-model="formStateWithoutFiles.description"
          type="textarea"
          placeholder="请输入关于该任务的任何描述性信息(如指定任务训练所需要的数据、参与任务的限制条件等)"
          autosize
        />
      </el-form-item>

      <el-form-item :label="AliasCN['modelName']">
        <el-select
          v-model="formStateWithoutFiles.modelName"
          placeholder="请选择模型"
        >
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="AliasCN['numberOfPeers']">
        <el-input-number
          v-model="formStateWithoutFiles.numberOfPeers"
          :min="1"
          :max="100"
          size="small"
        />
      </el-form-item>

      <el-form-item :label="AliasCN['timeLimit']">
        <!--      <el-date-picker-->
        <!--          v-model="formState.timeLimit"-->
        <!--          type="datetime"-->
        <!--          placeholder="选择日期时间"-->
        <!--      />-->
        <el-input-number
          v-model="formStateWithoutFiles.timeLimit"
          :min="1"
          :max="100"
          size="small"
        />
      </el-form-item>

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
            <!-- Drop file here or <em>click to upload</em>-->
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

    <el-button
      class="task-assign-btn"
      size="large"
      color="#000"
      @click="handleSubmit"
    >
      创建任务
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile, UploadRawFile } from 'element-plus'
import { ElNotification } from 'element-plus'
import { taskAssign } from '@/api/fLearning'
import { AliasCN } from '@/constants'
import { taskAssignFormValidator } from '@/utils/validators'

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

// 创建任务
const handleSubmit = async () => {
  const taskAssignFormState: FLearningAPI.TaskAssignParams = {
    ...formStateWithoutFiles,
    trainFile: uploadTrainFile,
    evaluateFile: uploadEvaluateFile,
  }

  try {
    await taskAssignFormValidator(taskAssignFormState)
  } catch (err) {
    ElNotification.error((err as Error).message)
  }

  try {
    const res = await taskAssign(taskAssignFormState)
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}
</script>

<style scoped lang="scss">
.task-assign-container {
  max-width: 500px;
  margin: 40px auto;

  .task-assign-form {
    border: 3px solid black;
    border-radius: 10px;
    padding: 40px 80px;
  }

  .task-assign-btn {
    width: 100%;
    margin-top: 50px;
  }
}
</style>
