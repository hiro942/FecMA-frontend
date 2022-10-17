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
    <DatasetInfo />

    <template v-if="modelSettings.datasetInfo.featureNames.length">
      <h3>特征工程</h3>
      <FeatureEngineeringSettings />
    </template>

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
import { UploadFileInfo, useMessage } from 'naive-ui'
import { toRaw } from 'vue'
import { taskAssign } from '@/api/fLearning'
import useStyleStore from '@/store/modules/style'
import { createLoading } from '@/utils/style'
import { modelNames } from '@/constants/algorithm'
import CommonSettings from '@/views/task-assign/components/CommonSettings.vue'
import SecureBoostSetting from '@/views/task-assign/components/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/views/task-assign/components/NeuralNetworkSettings.vue'
import LogisticRegressionSettings from '@/views/task-assign/components/LogisticRegressionSettings.vue'
import FeatureEngineeringSettings from '@/views/task-assign/components/FeatureEngineeringSettings.vue'
import DatasetInfo from '@/views/task-assign/components/DatasetInfo.vue'
import useModelSettings from '@/store/modules/modelSettings'

const modelSettings = useModelSettings()

const message = useMessage()
const styleStore = useStyleStore()
const {
  commonSettings,
  datasetInfo,
  featureEngineeringChecked,
  featureEngineeringSettings,
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

  // 筛选出启用的特征工程
  const featureParam: any = {}
  Object.assign(featureParam, toRaw(featureEngineeringSettings))
  Object.keys(featureEngineeringChecked).forEach((key) => {
    if (!featureEngineeringChecked[key]) {
      delete featureParam[key]
    }
  })

  const taskAssignParams = {
    ...commonSettings,
    ...datasetInfo,
    modelParam: JSON.stringify(toRaw(algorithmSettings)),
    featureParam: JSON.stringify(featureParam),
  }

  console.log('创建任务参数：', {
    ...commonSettings,
    ...datasetInfo,
    modelParam: algorithmSettings,
    featureParam,
  })

  // try {
  //   await taskAssignFormValidators.commonSettingsValidator(commonSettings)
  //   await taskAssignFormValidators.algorithmSettingsValidator(algorithmSettings)
  //   console.log(taskAssignParams)
  // } catch (err: any) {
  //   message.error(err.message)
  //   return
  // }

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
