import { defineStore } from 'pinia'

const useModelSettings = defineStore('modelSettings', () => {
  const secureBoostSettings: FLearningAPI.SecureBoostSettingOptions = {
    taskType: '',
    evalType: '',
    numTrees: 3,
    maxDepth: 3,
  }

  const neuralNetworkSettings: FLearningAPI.NeuralNetworkSettingOptions = {
    maxIter: 1000,
    batchSize: -1,

    // 算法配置
    algorithm: {
      loss: '',
      optimizer: {
        optimizer: 'Adam',
        learningRate: 0.001,
      },
    },

    layers: [
      {
        className: '',
        units: 0,
        useBias: true,
        activation: '',
        kernelInitializer: {
          className: '',
        },
        biasInitializer: {
          className: 'Zero',
        },
        kernelRegularizer: 'null',
        biasRegularizer: 'null',
        activity_regularizer: 'null',
        kernel_constraint: 'null',
        bias_constraint: 'null',
      },
    ],
  }

  return {
    secureBoostSettings,
    neuralNetworkSettings,
  }
})

export default useModelSettings
