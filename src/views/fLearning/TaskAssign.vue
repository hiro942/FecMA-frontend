<template>
  <el-form
    class="task-assign-form"
    label-position="top"
    :model="formStateWithoutFiles"
    inline
  >
    <div style="display: grid; grid-template-columns: 1fr 1fr">
      <el-form-item :label="AliasCN['taskName']" required>
        <el-input v-model="formStateWithoutFiles.taskName" class="input-box" />
      </el-form-item>

      <el-form-item :label="AliasCN['modelName']" required>
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

      <!--    <el-form-item :label="AliasCN['timeLimit']">-->
      <!--      &lt;!&ndash;      <el-date-picker&ndash;&gt;-->
      <!--      &lt;!&ndash;          v-model="formState.timeLimit"&ndash;&gt;-->
      <!--      &lt;!&ndash;          type="datetime"&ndash;&gt;-->
      <!--      &lt;!&ndash;          placeholder="选择日期时间"&ndash;&gt;-->
      <!--      &lt;!&ndash;      />&ndash;&gt;-->
      <!--      <el-input-number-->
      <!--        v-model="formStateWithoutFiles.timeLimit"-->
      <!--        class="input-box"-->
      <!--        :min="1"-->
      <!--      />-->
      <!--    </el-form-item>-->

      <el-form-item :label="AliasCN['numberOfPeers']" required>
        <el-input-number
          v-model="formStateWithoutFiles.numberOfPeers"
          class="input-box"
          :min="1"
        />
      </el-form-item>

      <div></div>

      <el-form-item :label="AliasCN['trainFile']" required>
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

      <el-form-item :label="AliasCN['evaluateFile']" required>
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
    </div>

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
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { fetchTaskAssignResult, taskAssign } from '@/api/fLearning'
import { AliasCN } from '@/constants'
import { taskAssignFormValidator } from '@/utils/validators'
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
  // timeLimit: 0,
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
  console.log(taskAssignFormState)

  try {
    await taskAssignFormValidator(taskAssignFormState)
  } catch (err) {
    ElMessage.error((err as Error).message)
    return
  }

  try {
    const { queryURL } = await taskAssign(taskAssignFormState)
    const timer = setInterval(async () => {
      const result = await fetchTaskAssignResult(queryURL)
      if (result === 'FINISHED') {
        clearInterval(timer)
        ElNotification.success('任务创建成功')
      }
      if (result === 'ERROR') {
        ElNotification.error('服务器出错，任务创建失败')
      }
    }, 2000)
    ElNotification.success('任务创建成功')
  } catch (err) {
    ElNotification.error('任务创建失败')
  }
}
</script>

<script lang="ts">
export default {
  name: 'TaskAssign',
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
