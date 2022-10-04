<template>
  <div id="task-assign-box" style="max-width: 800px; margin: auto">
    <h3>基本信息</h3>
    <common-settings />

    <template v-if="commonSettings.modelName">
      <h3>算法配置</h3>
      <n-alert title="提示" type="info" closable style="margin: 20px 0">
        若非出自明确训练需求，请尽量保持默认设置。设置不当可能会导致训练失败。
      </n-alert>
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

    <h3>训练数据</h3>
    <n-space>
      <UploadDragger
        action="xxx"
        filename="训练数据"
        tip="提示：文件只支持 CSV 格式"
      />

      <UploadDragger
        action="xxx"
        filename="测试数据"
        tip="提示：文件只支持 CSV 格式"
      />
    </n-space>

    <n-button
      secondary
      strong
      type="error"
      :loading="styleStore.assignBtnLoading"
      style="margin-top: 30px"
      @click="handleSubmit"
    >
      创建任务
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { toRaw } from 'vue'
import { taskAssign } from '@/api/fLearning'
import { taskAssignFormValidators } from '@/utils/validators'
import useStyleStore from '@/store/modules/style'
import { createLoading } from '@/utils/style'
import { modelNames } from '@/constants/algorithm'
import CommonSettings from '@/views/taskAssign/components/CommonSettings.vue'
import SecureBoostSetting from '@/views/taskAssign/components/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/views/taskAssign/components/NeuralNetworkSettings.vue'
import LogisticRegressionSettings from '@/views/taskAssign/components/LogisticRegressionSettings.vue'
import useModelSettings from '@/store/modules/modelSettings'
import { useMessage } from 'naive-ui'
import UploadDragger from '@/components/upload/UploadDragger.vue'

const message = useMessage()
const styleStore = useStyleStore()
const {
  commonSettings,
  secureBoostSettings,
  neuralNetworkSettings,
  logisticRegressionSettings,
} = useModelSettings()

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
  const algorithmSettings: FLearningModels.TaskAssign.AlgorithmSettings =
    getAlgorithmSettingsByModelName(commonSettings.modelName)

  const taskAssignParams = {
    ...commonSettings,
    algorithmSettings: JSON.stringify(toRaw(algorithmSettings)),
  }

  try {
    await taskAssignFormValidators.commonSettingsValidator(commonSettings)
    await taskAssignFormValidators.algorithmSettingsValidator(algorithmSettings)
    console.log(taskAssignParams)
  } catch (err: any) {
    message.error(err.message)
    return
  }

  try {
    styleStore.assignBtnLoading = true
    const loading = createLoading('正在上传训练文件...')
    await taskAssign(taskAssignParams)
    loading.close()
    message.info('任务创建约需一分钟左右，请稍等...', {
      duration: 10000,
      closable: true,
    })
  } catch (err: any) {
    message.error(err.message)
    styleStore.assignBtnLoading = false
  }
}
</script>
