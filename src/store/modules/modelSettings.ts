import { defineStore } from 'pinia'

const useModelSettings = defineStore('modelSettings', () => {
  const secureBoostSettings: FLearningAPI.SecureBoostSettings = {
    taskType: '',
    evalType: '',
    numTrees: 5,
    maxDepth: 3,
  }

  const neuralNetworkSettings: FLearningAPI.NeuralNetworkSettings = {
    maxIter: 100,
    batchSize: -1,

    // 算法配置
    loss: '',
    optimizer: 'Adam',
    learningRate: 0.001,

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

  const logisticRegressionSettings = {
    maxIter: 1000,
    batchSize: -1,
    optimizer: 'rmsprop',
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
    secureBoostSettings,
    neuralNetworkSettings,
    logisticRegressionSettings,
  }
})

export default useModelSettings
