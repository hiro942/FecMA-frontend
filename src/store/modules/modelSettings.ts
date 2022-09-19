import { defineStore } from 'pinia'
import { ref } from 'vue'
import useUpload from '@/hooks/useUpload'

const useModelSettings = defineStore('modelSettings', () => {
  const commonSettings: FLearningAPI.TaskAssign.CommonSettings = {
    taskName: '',
    modelName: '',
    timeLimit: 864000,
    numberOfPeers: 1,
    description: '',
  }

  const secureBoostSettings: FLearningAPI.TaskAssign.SecureBoostSettings = {
    taskType: '',
    evalType: '',
    numTrees: 5,
    maxDepth: 3,
  }

  const neuralNetworkSettings: FLearningAPI.TaskAssign.NeuralNetworkSettings = {
    maxIter: 100,
    batchSize: -1,

    // 算法配置
    loss: '',
    optimizer: 'SGD',
    learningRate: 0.001,
    earlyStop: 'diff',

    aggregateEveryNEpoch: 1,
    encodeLabel: false,

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

  const logisticRegressionSettings: FLearningAPI.TaskAssign.LogisticRegressionSettings =
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
      useProximal: false,
      mu: 0.1,
    }

  return {
    commonSettings,
    secureBoostSettings,
    neuralNetworkSettings,
    logisticRegressionSettings,
  }
})

export default useModelSettings
