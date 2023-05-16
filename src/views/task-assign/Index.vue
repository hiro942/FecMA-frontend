<template>
  <n-card class="px-20">
    <n-divider>基本信息</n-divider>
    <common-settings />

    <n-divider>模型配置</n-divider>
    <secure-boost-setting
      v-if="commonSettings.modelName === modelNamesMap.secureBoost"
    />
    <neural-network-setting
      v-if="commonSettings.modelName === modelNamesMap.neuralNetwork"
    />
    <lstm-settings v-if="commonSettings.modelName === modelNamesMap.lstm" />
    <logistic-regression-settings
      v-if="commonSettings.modelName === modelNamesMap.logisticRegression"
    />

    <n-space justify="space-between" align="center">
      <n-h3>数据集</n-h3>
      <n-radio-group v-model:value="datasetType" name="datasetTypeSelect">
        <n-radio-button value="csv">CSV数据集</n-radio-button>
        <n-radio-button value="image">图像数据集</n-radio-button>
      </n-radio-group>
    </n-space>

    <CSVDatasetSettings v-if="datasetType === 'csv'" />
    <ImageDatasetSettings v-if="datasetType === 'image'" />

    <!--    csv格式文件上传后进行特征工程配置-->
    <template
      v-if="datasetType === 'csv' && csvDatasetSettings.featureNames.length"
    >
      <n-divider>特征工程</n-divider>
      <FeatureEngineeringSettings />
    </template>

    <n-button
      :loading="styleStore.showLoading"
      secondary
      strong
      type="error"
      style="margin-top: 30px"
      @click="handleSubmit"
    >
      创建任务
    </n-button>
  </n-card>
</template>

<script setup lang="ts">
import { useMessage, useNotification } from 'naive-ui'
import { ref, toRaw } from 'vue'
import { taskAssign } from '@/api/fLearning'
import useStyleStore from '@/store/style'
import CommonSettings from '@/views/task-assign/CommonSettings.vue'
import SecureBoostSetting from '@/views/task-assign/SecureBoostSettings.vue'
import NeuralNetworkSetting from '@/views/task-assign/NeuralNetworkSettings/Index.vue'
import LogisticRegressionSettings from '@/views/task-assign/LogisticRegressionSettings.vue'
import FeatureEngineeringSettings from '@/views/task-assign/FeatureEngineeringSettings.vue'
import CSVDatasetSettings from '@/views/task-assign/CSVDatasetSettings.vue'
import ImageDatasetSettings from '@/views/task-assign/ImageDatasetSettings.vue'
import useModelSettingsStore from '@/store/modelSettings'
import { modelNamesMap } from '@/configs/maps'
import useGlobalStateStore from '@/store/globalState'
import LstmSettings from '@/views/task-assign/LstmSettings.vue'
import useLayerStore from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/layer'
import { data } from 'autoprefixer'

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
const layerStore = useLayerStore()
const datasetType = ref('csv')

const getAlgorithmSettingsByModelName = (modelName: string): any => {
  const algorithmSettings: any = {}
  switch (modelName) {
    case modelNamesMap.secureBoost: {
      Object.assign(algorithmSettings, secureBoostSettings)
      if (algorithmSettings.taskType === 'regression') {
        algorithmSettings.evalType = algorithmSettings.taskType
      }
      break
    }
    case modelNamesMap.neuralNetwork: {
      Object.assign(algorithmSettings, neuralNetworkSettings)
      Object.assign(algorithmSettings.layers, layerStore.totalLayers)
      break
    }
    case modelNamesMap.logisticRegression: {
      Object.assign(algorithmSettings, logisticRegressionSettings)
      break
    }
    case modelNamesMap.lstm: {
      Object.assign(algorithmSettings, lstmSettings)
      commonSettings.modelName = modelNamesMap.neuralNetwork // lstm 属于 nn
      break
    }
  }
  return algorithmSettings
}

const handleSubmit = () => {
  globalStateStore.taskAssignFormValid = true // 初始为验证成功状态，任一表单验证失败则设为false
  globalStateStore.doTaskAssignFormValidate = true // 开启表单验证

  // 神经网络必须配置模型结构
  if (
    commonSettings.modelName === 'homo_nn' &&
    !layerStore.totalLayers.length
  ) {
    globalStateStore.taskAssignFormValid = false // 验证失败
    globalStateStore.doTaskAssignFormValidate = false // 关闭验证
    message.error('请配置网络模型结构')
    return
  }

  setTimeout(async () => {
    // 表单验证成功后进行其他验证
    if (globalStateStore.taskAssignFormValid) {
      // 根据所选模型，读取对应的算法配置
      const algorithmSettings = getAlgorithmSettingsByModelName(
        commonSettings.modelName
      )

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
        evaluateFile: dataset.trainFile,
        modelParam: JSON.stringify(toRaw(algorithmSettings)),
        featureParam: JSON.stringify(featureParam),
      }
      if (datasetType.value === 'csv') {
        // TODO 后端要求 csv 格式数据集参数直接传，featureNames 转成json
        Object.assign(taskAssignParams, {
          labelName: csvDatasetSettings.labelName,
        })
        Object.assign(taskAssignParams, {
          featureNames: JSON.stringify(csvDatasetSettings.featureNames),
        })
      } else if (datasetType.value === 'image') {
        // TODO 后端要求图片数据集参数放在 uploadPictureParam 传递
        taskAssignParams.uploadPictureParam =
          JSON.stringify(imageDatasetSettings)
      }

      try {
        // 创建
        await taskAssign(taskAssignParams)
        notification.info({
          title: '任务发布中...',
          content: '稍后可在「我的任务」页面进行查看',
          duration: 60000,
        })
      } catch (err: any) {
        message.error(err.message)
      }
    } else {
      // 表单验证失败
      message.error('请完整填写表单')
    }

    globalStateStore.doTaskAssignFormValidate = false // 关闭验证
  }, 100)
}
</script>