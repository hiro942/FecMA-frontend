<template>
  <el-form
    class="task-assign-form"
    label-position="top"
    :model="formStateWithoutFiles"
    inline
    :rules="formValidationRules"
  >
    <div style="display: grid; grid-template-columns: 1fr 1fr">
      <el-form-item :label="AliasCN['taskName']" prop="taskName">
        <el-input v-model="formStateWithoutFiles.taskName" class="input-box" />
      </el-form-item>

      <el-form-item :label="AliasCN['modelName']" prop="modelName">
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

      <!--          <el-form-item :label="AliasCN['timeLimit']">-->
      <!--            &lt;!&ndash;      <el-date-picker&ndash;&gt;-->
      <!--            &lt;!&ndash;          v-model="formState.timeLimit"&ndash;&gt;-->
      <!--            &lt;!&ndash;          type="datetime"&ndash;&gt;-->
      <!--            &lt;!&ndash;          placeholder="选择日期时间"&ndash;&gt;-->
      <!--            &lt;!&ndash;      />&ndash;&gt;-->
      <!--            <el-input-number-->
      <!--              v-model="formStateWithoutFiles.timeLimit"-->
      <!--              class="input-box"-->
      <!--              :min="1"-->
      <!--            />-->
      <!--          </el-form-item>-->

      <el-form-item :label="AliasCN['numberOfPeers']" prop="numberOfPeers">
        <el-input-number
          v-model="formStateWithoutFiles.numberOfPeers"
          class="input-box"
          :min="1"
        />
      </el-form-item>

      <div></div>

      <el-form-item :label="AliasCN['trainFile']" prop="trainFile">
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

      <el-form-item :label="AliasCN['evaluateFile']" prop="evaluateFile">
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

    <el-form-item :label="AliasCN['description']" prop="description">
      <el-input
        v-model="formStateWithoutFiles.description"
        class="input-box text-area"
        type="textarea"
        placeholder="请输入关于该任务的任何描述性信息(如指定任务训练所需要的数据、参与任务的限制条件等)"
        :rows="5"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        class="submit-btn"
        :loading="styleStore.assignBtnLoading"
        type="danger"
        @click="handleSubmit"
      >
        创建任务
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import UploadContent from '@/components/upload/UploadContent.vue'
import { reactive } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { taskAssign } from '@/api/fLearning'
import { taskAssignFormValidator } from '@/utils/validators'
import useUpload from '@/hooks/useUpload'
import { LocalStorage, setLocal } from '@/utils/localStorage'
import { AliasCN } from '@/constants/alias'
import useStyleStore from '@/store/modules/style'
import { watchAsyncResult } from '@/utils/watchers'
import { errorCatcher } from '@/utils/handlers'
import { createLoading } from '@/utils/style'

const styleStore = useStyleStore()

const formValidationRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  modelName: [{ required: true, message: '请选择训练模型', trigger: 'change' }],
  numberOfPeers: [{ required: true }],
  trainFile: [{ required: true }],
  evaluateFile: [{ required: true }],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blue' }],
}

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

  try {
    await taskAssignFormValidator(taskAssignFormState)
  } catch (err) {
    errorCatcher(err)
    return
  }

  try {
    styleStore.assignBtnLoading = true
    const loading = createLoading('正在上传训练文件...')
    const { queryURL } = await taskAssign(taskAssignFormState)
    loading.close()
    ElMessage.info({
      message: '任务创建约需一分钟左右，请稍等...',
      duration: 10000,
      showClose: true,
    })
    setLocal(LocalStorage.AssignResultCallback, {
      taskName: taskAssignFormState.taskName,
      callbackURL: queryURL,
    })
    watchAsyncResult(LocalStorage.AssignResultCallback)
  } catch (err) {
    errorCatcher(err)
    styleStore.assignBtnLoading = false
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
