declare namespace FLearningModels {
  // 任务信息
  type Task = {
    taskName: string
    modelID: string
    partyID: string // 任务隶属组织
    assignDateTime: string
    isAssigner?: number // 1是，0否
    currentPeers: number
    minPeers: number
    state: string
    timeLimit: number
  }

  // 任务详情
  type TaskDetail = {
    taskName: string
    modelID: string
    modelName: string
    assignDateTime: string
    assigner: {
      nickname: string
      avatarUrl: string
      participateDateTime: string
    }
    acceptors: {
      nickname: string
      avatarUrl: string
      participateDateTime: string
      partyID: string
    }[]
    state: string
    timeLimit: number
    description: string
  }

  declare namespace TaskAssign {
    // [Params]:任务创建 - 通用基本信息
    type CommonSettings = {
      // 基本信息
      taskName: string // 任务名
      modelName: string // 模型名
      timeLimit: number // 参与截止时间
      minPeers: number // 至少需要多少参与方
      description: string // 任务描述
    }

    // SecureBoost配置
    type SecureBoostSettings = {
      taskType: string // 任务类型（classification、regression）
      evalType: string // 输出类型（如果 taskType 是 classification，那么选项有 binary 和 multi，否则固定为 regression）
      numTrees: number // 树的个数
      maxDepth: number // 最大树深
    }

    // 神经网络配置
    type NeuralNetworkSettings = {
      maxIter: number // 模型最大更新次数
      batchSize: number // -1 为 full batch
      layers?: any
      loss: string // 损失函数
      optimizer: string // 优化算法名。（eg：Adam）
      learningRate: number // 学习率
      earlyStop: string
      encodeLabel: number // 是否将标签编码为one-hot向量

      // homo
      aggregateEveryNEpoch: number // 多少epoch聚合一次模型
    }

    // 逻辑回归配置
    type LogisticRegressionSettings = {
      // 通用
      maxIter: number // default 100
      batchSize: number
      optimizer: string
      learningRate: number
      penalty: string // L1 or L2，default L2
      alpha: number // 正则强度系数，default 1.0
      earlyStop: string // 判断是否收敛的方式 diff，weight_diff，abs。 default diff
      decay: number // 学习率衰减系数，默认为1 （lr=lr0/1+decay*t，t为迭代次数）

      // homo
      aggregateIters: number // 多少次迭代聚合一次
      useProximal: number // 是否开启近端项 default 0 更多细节参考 https://arxiv.org/abs/1812.06127
      mu: number // 近端项的缩放系数 default 0.1
    }

    type AlgorithmSettings =
      | SecureBoostSettings
      | NeuralNetworkSettings
      | LogisticRegressionSettings
  }

  // [Params]:任务接收
  type TaskAcceptParams = {
    modelID: string
  }

  // [Params]:任务训练
  type TaskTrainParams = {
    modelID: string
  }
}
