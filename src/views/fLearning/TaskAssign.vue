<template>
  <el-form class="task-assign-form" label-position="top" :model="formState">
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
        <el-input-number
          v-model="formState.numberOfPeers"
          :precision="0"
          :min="1"
        />
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

    <h3>
      <span>算法配置</span>
      <el-switch
        v-if="formState.modelName !== ''"
        v-model="editorMode"
        active-text="高级自定义配置"
        style="float: right"
      />
    </h3>
    <div>
      <em
        v-if="formState.modelName === ''"
        style="color: #888; font-size: small"
      >
        选择模型后进行模型算法配置
      </em>
      <el-alert
        v-if="formState.modelName"
        title="若非出自明确训练需求，请尽量保持默认设置。设置不当可能会导致训练失败！"
        type="info"
        show-icon
        style="margin: 20px 0"
      />
      <code-editor v-if="editorMode"></code-editor>
      <template v-else>
        <secure-boost-setting
          v-if="formState.modelName === modelName.secureboost"
        />
        <neural-network-setting
          v-if="formState.modelName === modelName.neuralNetwork"
        />
        <logistic-regression-settings
          v-if="formState.modelName === modelName.logisticRegression"
        />
      </template>
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
import { ref, reactive, toRaw } from 'vue'
import { ElMessage } from 'element-plus'
import { taskAssign } from '@/api/fLearning'
import { taskAssignFormValidator } from '@/utils/validators'
import useUpload from '@/hooks/useUpload'
import { LocalStorage, setLocal } from '@/utils/localStorage'
import { AliasCN } from '@/constants/alias'
import useStyleStore from '@/store/modules/style'
import { watchAsyncResult } from '@/utils/watchers'
import { errorCatcher } from '@/utils/handlers'
import { createLoading } from '@/utils/style'
import { modelOptions, modelName } from '@/constants/model'
import CodeEditor from '@/components/fLearning/TaskAssign/CodeEditor.vue'
import SecureBoostSetting from '@/components/fLearning/TaskAssign/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/components/fLearning/TaskAssign/NeuralNetworkSettings.vue'
import LogisticRegressionSettings from '@/components/fLearning/TaskAssign/LogisticRegressionSettings.vue'
import useModelSettings from '@/store/modules/modelSettings'

const styleStore = useStyleStore()
const modelSettings = useModelSettings()

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

const editorMode = ref(false) // 编辑器自定义配置

const changeEditorMode = () => {
  editorMode.value = !editorMode.value
}

// 创建任务
const handleSubmit = async () => {
  let settings // 从pinia中读取算法配置
  if (formState.modelName === modelName.secureboost) {
    settings = modelSettings.secureBoostSettings
    if (settings.taskType === 'regression') {
      settings.evalType = settings.taskType
    }
  } else if (formState.modelName === modelName.neuralNetwork) {
    settings = modelSettings.neuralNetworkSettings
  }
  const taskAssignFormState: FLearningAPI.TaskAssignParams = {
    ...formState,
    trainFile: uploadTrainFile.value,
    evaluateFile: uploadEvaluateFile.value,
    settings: JSON.stringify(toRaw(settings)),
  }

  try {
    await taskAssignFormValidator(taskAssignFormState)
    console.log(taskAssignFormState)
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
