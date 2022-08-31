<template>
  <div id="task-assign-box">
    <h3>基本信息</h3>
    <common-settings />

    <template v-if="commonSettings.modelName">
      <h3>算法配置</h3>
      <el-switch v-model="editorMode" active-text="高级自定义配置" />
      <el-alert
        title="若非出自明确训练需求，请尽量保持默认设置。设置不当可能会导致训练失败！"
        type="info"
        show-icon
        style="margin: 20px 0"
      />
      <code-editor v-if="editorMode" />
      <template v-else>
        <secure-boost-setting
          v-if="commonSettings.modelName === modelNames.secureBoost"
        />
        <neural-network-setting
          v-if="commonSettings.modelName === modelNames.neuralNetwork"
        />
        <logistic-regression-settings
          v-if="commonSettings.modelName === modelNames.logisticRegression"
        />
      </template>
    </template>

    <h3>数据集</h3>
    <el-form label-position="top" inline>
      <el-form-item :label="AliasCN['trainFile']" style="width: 280px">
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

      <el-form-item :label="AliasCN['evaluateFile']" style="width: 280px">
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
    </el-form>

    <el-button
      class="submit-btn"
      :loading="styleStore.assignBtnLoading"
      type="danger"
      @click="handleSubmit"
    >
      创建任务
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue'
import { AliasCN } from '@/constants/alias'
import { ElMessage } from 'element-plus'
import { taskAssign } from '@/api/fLearning'
import { taskAssignFormValidators } from '@/utils/validators'
import { LocalStorage, setLocal } from '@/utils/localStorage'
import useStyleStore from '@/store/modules/style'
import { watchAsyncResult } from '@/utils/watchers'
import { errorCatcher } from '@/utils/handlers'
import { createLoading } from '@/utils/style'
import { modelNames } from '@/constants/model'
import CodeEditor from '@/components/fLearning/TaskAssign/CodeEditor.vue'
import CommonSettings from '@/components/fLearning/TaskAssign/CommonSettings.vue'
import SecureBoostSetting from '@/components/fLearning/TaskAssign/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/components/fLearning/TaskAssign/NeuralNetworkSettings.vue'
import LogisticRegressionSettings from '@/components/fLearning/TaskAssign/LogisticRegressionSettings.vue'
import useModelSettings from '@/store/modules/modelSettings'
import useUpload from '@/hooks/useUpload'
import UploadContent from '@/components/upload/UploadContent.vue'

const styleStore = useStyleStore()
const {
  commonSettings,
  secureBoostSettings,
  neuralNetworkSettings,
  logisticRegressionSettings,
} = useModelSettings()

const {
  uploadTrainFile,
  uploadEvaluateFile,
  handleTrainFileChange,
  handleEvaluateFileChange,
} = useUpload()

const editorMode = ref(false) // 编辑器自定义配置

const getAlgorithmSettingsByModelName = (modelName: string): any => {
  let algorithmSettings
  if (modelName === modelNames.secureBoost) {
    algorithmSettings = secureBoostSettings
    if (algorithmSettings.taskType === 'regression') {
      algorithmSettings.evalType = algorithmSettings.taskType
    }
  } else if (modelName === modelNames.neuralNetwork) {
    algorithmSettings = neuralNetworkSettings
  } else if (modelName === modelNames.logisticRegression) {
    algorithmSettings = logisticRegressionSettings
  }
  return algorithmSettings
}

// 创建任务
const handleSubmit = async () => {
  // 从pinia中读取算法配置
  const algorithmSettings: FLearningAPI.TaskAssign.AlgorithmSettings =
    getAlgorithmSettingsByModelName(commonSettings.modelName)

  const taskAssignParams = {
    ...commonSettings,
    trainFile: uploadTrainFile.value,
    evaluateFile: uploadEvaluateFile.value,
    algorithmSettings: JSON.stringify(toRaw(algorithmSettings)),
  }

  try {
    await taskAssignFormValidators.commonSettingsValidator(commonSettings)
    await taskAssignFormValidators.algorithmSettingsValidator(algorithmSettings)
    console.log(taskAssignParams)
  } catch (err) {
    errorCatcher(err)
    return
  }

  try {
    styleStore.assignBtnLoading = true
    const loading = createLoading('正在上传训练文件...')
    const { queryURL } = await taskAssign(taskAssignParams)
    loading.close()
    ElMessage.info({
      message: '任务创建约需一分钟左右，请稍等...',
      duration: 10000,
      showClose: true,
    })
    setLocal(LocalStorage.AssignResultCallback, {
      taskName: taskAssignParams,
      callbackURL: queryURL,
    })
    watchAsyncResult(LocalStorage.AssignResultCallback)
  } catch (err) {
    errorCatcher(err)
    styleStore.assignBtnLoading = false
  }
}
</script>

<style lang="scss">
#task-assign-box {
  padding: 0 50px;

  /*固定任务创建表单中的所有表单项长度*/
  .el-input,
  .el-select,
  .el-input-number,
  .el-switch {
    width: 220px;
  }

  .submit-btn {
    width: 150px;
    height: 50px;
    margin-top: 20px;
  }
}
</style>
