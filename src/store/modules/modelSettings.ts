import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import useUpload from '@/hooks/useUpload'
import { FormInst } from 'naive-ui'

const useModelSettings = defineStore('modelSettings', () => {
  const commonSettingsFormRef = ref<FormInst | null>(null)
  const commonSettings = ref<FLearningModels.TaskAssign.CommonSettings>({
    taskName: '',
    modelName: '',
    timeLimit: Date.now() + 86400 * 1000,
    minPeers: 1,
    description: '',
  })

  const secureBoostSettings: FLearningModels.TaskAssign.SecureBoostSettings = {
    taskType: '',
    evalType: '',
    numTrees: 5,
    maxDepth: 3,
  }

  const neuralNetworkSettings: FLearningModels.TaskAssign.NeuralNetworkSettings =
    {
      maxIter: 100,
      batchSize: -1,

      // 算法配置
      loss: '',
      optimizer: 'SGD',
      learningRate: 0.001,
      earlyStop: 'diff',

      aggregateEveryNEpoch: 1,
      encodeLabel: 0,

      // layers: [
      //   {
      //     className: '',
      //     units: 0,
      //     useBias: true,
      //     activation: '',
      //     kernelInitializer: {
      //       className: '',
      //     },
      //     biasInitializer: {
      //       className: 'Zero',
      //     },
      //     kernelRegularizer: 'null',
      //     biasRegularizer: 'null',
      //     activity_regularizer: 'null',
      //     kernel_constraint: 'null',
      //     bias_constraint: 'null',
      //   },
      // ],
    }

  const logisticRegressionSettings: FLearningModels.TaskAssign.LogisticRegressionSettings =
    {
      maxIter: 100,
      batchSize: -1,
      optimizer: 'RMSProp',
      learningRate: 0.001,
      penalty: 'L2',
      earlyStop: 'diff',
      alpha: 1.0,
      decay: 1,

      aggregateIters: 1,
      useProximal: 0,
      mu: 0.1,
    }

  return {
    commonSettingsFormRef,
    commonSettings,
    secureBoostSettings,
    neuralNetworkSettings,
    logisticRegressionSettings,
  }
})

export default useModelSettings
