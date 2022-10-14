import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import useUpload from '@/hooks/useUpload'
import { FormInst } from 'naive-ui'

const useModelSettings = defineStore('modelSettings', () => {
  const commonSettings: FLearningModels.TaskAssign.CommonSettings = {
    taskName: '',
    modelName: '',
    timeLimit: Date.now() + 86400 * 1000,
    minPeers: 1,
    description: '',
  }

  const datasetInfo: FLearningModels.TaskAssign.DatasetInfo = {
    trainFile: undefined,
    evaluateFile: undefined,
    labelName: '',
    featureNames: [],
  }

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

  const featureEngineeringChecked: any = {
    HomoFeatureBinning: false,
    FeatureScale: false,
  }
  const featureEngineeringSettings: FLearningModels.TaskAssign.FeatureEngineeringSettings =
    {
      HomoFeatureBinning: {
        method: 'recursive_query',
        sampleBins: 10,
        binNames: [],
      },
      FeatureScale: {
        method: 'min_max_scale',
      },
    }

  return {
    commonSettings,
    datasetInfo,
    secureBoostSettings,
    neuralNetworkSettings,
    logisticRegressionSettings,
    featureEngineeringChecked,
    featureEngineeringSettings,
  }
})

export default useModelSettings
