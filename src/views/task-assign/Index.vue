<template>
  <n-card class="px-20">
    <n-h3>基本信息</n-h3>
    <common-settings />

    <!--    TODO: lstm暂时不需要配置-->
    <template
      v-if="
        commonSettings.modelName &&
        commonSettings.modelName !== modelNamesMap.lstm
      "
    >
      <n-h3>算法配置</n-h3>
      <n-alert type="warning" class="my-[20px]">
        若非出自明确训练需求，请尽量保持默认设置。设置不当可能会导致训练失败。
      </n-alert>
      <secure-boost-setting
        v-if="commonSettings.modelName === modelNamesMap.secureBoost"
      />
      <neural-network-setting
        v-if="commonSettings.modelName === modelNamesMap.neuralNetwork"
      />
      <logistic-regression-settings
        v-if="commonSettings.modelName === modelNamesMap.logisticRegression"
      />
    </template>

    <n-space justify="space-between" align="center">
      <n-h3>数据集</n-h3>
      <n-radio-group v-model:value="datasetType" name="datasetTypeSelect">
        <n-radio-button value="csv">CSV数据集 </n-radio-button>
        <n-radio-button value="image">图像数据集</n-radio-button>
      </n-radio-group>
    </n-space>

    <CSVDatasetSettings v-if="datasetType === 'csv'" />
    <ImageDatasetSettings v-if="datasetType === 'image'" />

    <!--    csv格式文件上传后进行特征工程配置-->
    <template
      v-if="datasetType === 'csv' && csvDatasetSettings.featureNames.length"
    >
      <n-h3>特征工程</n-h3>
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
  </n-card>
</template>

<script setup lang="ts">
import { useMessage, useNotification } from 'naive-ui'
import { ref, toRaw, watchEffect } from 'vue'
import { taskAssign } from '@/api/fLearning'
import useStyleStore from '@/store/style'
import CommonSettings from '@/views/task-assign/CommonSettings.vue'
import SecureBoostSetting from '@/views/task-assign/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/views/task-assign/NeuralNetworkSettings.vue'
import LogisticRegressionSettings from '@/views/task-assign/LogisticRegressionSettings.vue'
import FeatureEngineeringSettings from '@/views/task-assign/FeatureEngineeringSettings.vue'
import CSVDatasetSettings from '@/views/task-assign/CSVDatasetSettings.vue'
import ImageDatasetSettings from '@/views/task-assign/ImageDatasetSettings.vue'
import useModelSettingsStore from '@/store/modelSettings'
import { modelNamesMap } from '@/configs/maps'
import useGlobalStateStore from '@/store/globalState'

const notification = useNotification()
const message = useMessage()
const globalStateStore = useGlobalStateStore()
const styleStore = useStyleStore()
const {
  commonSettings,
  dataset,
  csvDatasetSettings,
  imageDatasetSettings,
  featureEngineeringChecked,
  featureEngineeringSettings,
  secureBoostSettings,
  neuralNetworkSettings,
  logisticRegressionSettings,

  lstmSettings,
} = useModelSettingsStore()
const datasetType = ref('csv')

const getAlgorithmSettingsByModelName = (modelName: string): any => {
  let algorithmSettings
  if (modelName === modelNamesMap.secureBoost) {
    algorithmSettings = secureBoostSettings
    if (algorithmSettings.taskType === 'regression') {
      algorithmSettings.evalType = algorithmSettings.taskType
    }
  } else if (modelName === modelNamesMap.neuralNetwork) {
    algorithmSettings = neuralNetworkSettings
  } else if (modelName === modelNamesMap.logisticRegression) {
    algorithmSettings = logisticRegressionSettings
  }

  switch (modelName) {
    case modelNamesMap.secureBoost: {
      algorithmSettings = secureBoostSettings
      if (algorithmSettings.taskType === 'regression') {
        algorithmSettings.evalType = algorithmSettings.taskType
      }
    }
    case modelNamesMap.neuralNetwork: {
      algorithmSettings = neuralNetworkSettings
    }
    case modelNamesMap.logisticRegression: {
      algorithmSettings = logisticRegressionSettings
    }
    case modelNamesMap.lstm: {
      algorithmSettings = lstmSettings
      commonSettings.modelName = modelNamesMap.neuralNetwork // lstm 属于 nn
    }
  }
  return algorithmSettings
}

const handleSubmit = () => {
  globalStateStore.taskAssignFormValid = true // 初始为验证成功状态，任一表单验证失败则设为false
  globalStateStore.doTaskAssignFormValidate = true // 开启验证

  setTimeout(async () => {
    // 表单验证成功后进行任务创建
    if (globalStateStore.taskAssignFormValid) {
      // 根据所选模型，读取对应的算法配置
      const algorithmSettings: FLearningModels.TaskAssign.AlgorithmSettings =
        getAlgorithmSettingsByModelName(commonSettings.modelName)

      // 筛选出启用的特征工程，没选就不传
      const featureParam: any = {}
      Object.assign(featureParam, toRaw(featureEngineeringSettings))
      Object.keys(featureEngineeringChecked).forEach((key) => {
        if (!featureEngineeringChecked[key]) {
          delete featureParam[key]
        }
      })

      // 构造提交参数
      const taskAssignParams: any = {
        ...commonSettings,
        ...dataset,
        modelParam: JSON.stringify(toRaw(algorithmSettings)),
        featureParam: JSON.stringify(featureParam),
      }
      if (datasetType.value === 'csv') {
        taskAssignParams.csvDatasetParam = JSON.stringify(csvDatasetSettings)
      } else if (datasetType.value === 'image') {
        taskAssignParams.imageDatasetParam =
          JSON.stringify(imageDatasetSettings)
      }

      // 创建
      try {
        await taskAssign(taskAssignParams)
        notification.info({
          content: '正在创建任务，请稍等...',
          duration: 60000,
        })
      } catch (err: any) {
        message.error(err.message)
        styleStore.assignBtnLoading = false
      }
    } else {
      // 表单验证失败
      message.error('请填写完整表单')
    }

    globalStateStore.doTaskAssignFormValidate = false // 关闭验证
  }, 1)
}
</script>
