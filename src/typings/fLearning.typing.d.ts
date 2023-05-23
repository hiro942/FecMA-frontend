declare namespace FLearningModels {
  // 任务信息
  type Task = {
    taskName: string
    modelID: string
    modelName: string
    partyID: string // 任务隶属组织
    assignDateTime: string
    isAssigner?: number // 1是，0否
    currentPeers: number
    // minPeers: number
    state: string
    result: string // state 为 FINISHED 状态下：SUCCESS 表示训练成功，ERROR 为训练失败
    isConverged: boolean | null
    timeLimit: number
  }

  // 模型信息
  type Model = {
    modelID: string
    taskName: string
    modelName: string
    assignDateTime: string
    currentPeers: number
    accuracy: number
  }

  // 推理历史结果
  type InferenceHistory = {
    inferenceDateTime: string
    inferenceFile: {
      fileName: string
      url: string
    }
    result: {
      content: string // JSON
      url: string
    }
    state: number // 1成功 2失败
  }

  // 任务详情
  type TaskDetail = {
    taskName: string
    modelID: string
    modelName: string
    assignDateTime: string
    assigner: {
      nickname: string
      participateDateTime: string
    }
    acceptors: {
      nickname: string
      participateDateTime: string
    }[]
    state: string
    timeLimit: number
    description: string

    // csv任务参数
    labelName?: string
    featureNames?: {
      name: string
      description: string
    }[]

    // 图片任务参数
    uploadPictureParam?: {
      interpolation: string
      processSize: {
        height: number
        width: number
      }
      readFlag: string
    }
  }

  declare namespace TaskAssign {
    // [Params]:任务创建 - 通用基本信息
    type CommonSettings = {
      // 基本信息
      taskName: string // 任务名
      modelName: string // 模型名
      timeLimit: number // 参与截止时间
      description: string // 任务描述
    }

    type Dataset = {
      trainFile: any
      evaluateFile: any
    }

    type CSVDatasetSettings = {
      labelName: string
      featureNames: {
        name: string
        description: string
      }[]
    }

    type ImageDatasetSettings = {
      processSize: {
        width: number
        height: number
      }
      interpolation: string // resize方法, 默认为 'INTER_LINEAR'（双线性插值）
      readFlag: string // 图片读取方法
    }

    // SecureBoost配置
    type SecureBoostSettings = {
      evalType: string // 任务类型
      numTrees: number // 树的个数
      maxDepth: number // 最大树深
    }

    // 神经网络配置
    type NeuralNetworkSettings = {
      evalType: string // 任务类型
      maxIter: number // 模型最大更新次数
      batchSize: number // -1 为 full batch
      layers?: any
      loss: string // 损失函数
      optimizer: string // 优化算法名。（eg：Adam）
      learningRate: number // 学习率
      earlyStop: string
      encodeLabel: number // 是否将标签编码为one-hot向量
      aggregateEveryNEpoch: number // 多少epoch聚合一次模型
    }

    // 逻辑回归配置
    type LogisticRegressionSettings = {
      evalType: string // 任务类型
      // 通用
      maxIter: number // default 100
      batchSize: number
      optimizer: string
      learningRate: number
      penalty: string // L1 or L2，default L2
      alpha: number // 正则强度系数，default 1.0
      earlyStop: string // 判断是否收敛的方式 diff，weight_diff，abs。 default diff
      decay: number // 学习率衰减系数，默认为1 （lr=lr0/1+decay*t，t为迭代次数）
      aggregateIters: number // 多少次迭代聚合一次
      useProximal: number // 是否开启近端项 default: false 更多细节参考 https://arxiv.org/abs/1812.06127
      mu: number // 近端项的缩放系数 default 0.1
    }

    type AlgorithmSettings =
      | SecureBoostSettings
      | NeuralNetworkSettings
      | LogisticRegressionSettings

    type FeatureEngineeringSettings = {
      HomoFeatureBinning: {
        method: string // 方法名
        sampleBins: number // 样本分箱
        binNames: string[] // 分箱的特征名
      }
      FeatureScale: {
        method: string // 方法名
      }
    }
  }

  // [Params]:任务接收
  type TaskAcceptParams = {
    modelID: string
    trainFile: any
    evaluateFile: any
  }

  // [Return]:模型指标
  type Metric = {
    eval: {
      train: any
      validate: any
    }
    train: {
      train: {
        loss: {
          data: [number, number][] // iteration,loss
          meta: any
        }
      }
    }
  }
}
