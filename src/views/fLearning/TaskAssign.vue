<template>
  <el-form
    class="task-assign-form"
    label-position="top"
    :model="formState"
    :rules="formValidationRules"
  >
    <h3>基本信息</h3>
    <div style="display: flex; column-gap: 30px">
      <el-form-item :label="AliasCN['taskName']" prop="taskName">
        <el-input v-model="formState.taskName" />
      </el-form-item>

      <el-form-item :label="AliasCN['description']" prop="description">
        <el-input
          v-model="formState.description"
          placeholder="所需数据、参与限制等"
        />
      </el-form-item>

      <el-form-item :label="AliasCN['numberOfPeers']" prop="numberOfPeers">
        <el-input v-model="formState.numberOfPeers" />
      </el-form-item>

      <el-form-item :label="AliasCN['modelName']" prop="modelName">
        <el-select v-model="formState.modelName" placeholder="请选择模型">
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
    </div>

    <h3>算法配置</h3>
    <div style="display: flex; column-gap: 30px; flex-wrap: wrap">
      <div
        v-if="formState.modelName === ''"
        style="color: #888; font-size: small"
      >
        选择模型后进行模型算法配置
      </div>
      <secure-boost-setting v-if="formState.modelName === 'HomoSecureboost'" />
      <neural-network-setting v-if="formState.modelName === 'Homo_nn'" />
    </div>

    <h3>数据集</h3>
    <div style="display: flex; column-gap: 30px">
      <el-form-item :label="AliasCN['trainFile']" prop="trainFile">
        <el-upload
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
import { ref, reactive, watchEffect } from 'vue'
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
import { modelOptions } from '@/constants/model'
import SecureBoostSetting from '@/components/fLearning/TaskAssign/SecureBoostSetting.vue'
import NeuralNetworkSetting from '@/components/fLearning/TaskAssign/NeuralNetworkSetting.vue'
import useModelSettings from '@/store/modules/modelSettings'

const styleStore = useStyleStore()
const modelSettings = useModelSettings()

const formValidationRules = {
  taskName: [{ required: true, message: '此为必填项', trigger: 'blur' }],
  federatedType: [
    { required: true, message: '请选择联邦类型', trigger: 'change' },
  ],
  numberOfPeers: [{ required: true, message: '此为必填项' }],
  trainFile: [{ required: false }],
  evaluateFile: [{ required: false }],
}

const formState = reactive<FLearningAPI.TaskAssignParams>({
  taskName: '',
  modelName: '',
  numberOfPeers: 1,
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
  let settings
  if (formState.modelName === 'Homo_nn') {
    settings = modelSettings.neuralNetworkSettings
  } else if (formState.modelName === 'HomoSecureboost') {
    settings = modelSettings.secureBoostSettings
  }
  const taskAssignFormState: FLearningAPI.TaskAssignParams = {
    ...formState,
    trainFile: uploadTrainFile.value,
    evaluateFile: uploadEvaluateFile.value,
    settings,
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
  h3 {
    text-align: left;
  }

  //max-width: 800px;
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
