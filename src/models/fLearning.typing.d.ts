declare namespace FLearningAPI {
  import { UploadRawFile } from 'element-plus'

  // 任务信息
  type TaskInfo = {
    taskName: string
    modelID: string
    partyID: string // 任务隶属组织
    assignDateTime: string
    identity?: string // 表示自己是人物创建者还是接收人 [assigner, acceptor]
    currentNumber: number
    numberOfPeers: number
    state: string
    timeLimit: number
  }

  // 任务详情
  type TaskDetail = {
    taskName: string
    modelID: string
    modelName: string
    createTime: string
    assigner: {
      nickname: string
      avatarUrl: string
      participateDateTime: string
    }
    acceptors: {
      nickname: string
      avatarUrl: string
      partyID: string
      participateDateTime: string
    }[]
    state: string
    timeLimit: number
    description: string
  }

  // [Params]:任务创建
  type TaskAssignParams = {
    // 基本信息
    taskName: string // 任务名
    modelName: string // 模型名
    numberOfPeers: number // 接收任务的最大边缘节点数
    description: string // 任务描述

    trainFile?: UploadRawFile // 训练文件
    evaluateFile?: UploadRawFile // 测试文件

    settings?: string // 模型配置（json字符串），根据modelName判断具体模型
  }

  // 查看支持的配置项：https://github.com/tensorflow/docs/tree/r1.14/site/en/api_docs/python/tf/keras
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
    // layers?: {
    //   className: string // 该层的类型名（eg: Dense）
    //   units?: number // 神经元数量（仅dense层可配置）
    //   useBias?: boolean // 是否添加偏置
    //   activation?: string // 激活函数。sigmoid、relu
    //   kernelInitializer?: {
    //     className: string // 权重的初始化方式。如 GlorotUniform（即Xavier初始化）、Zero
    //     seed?: number // 随机种子/
    //   }
    //   biasInitializer?: {
    //     className: string // 默认为 Zero
    //   }
    //   kernelRegularizer?: string // 权重正则。l1、l2。（null by default）
    //   biasRegularizer?: string // 偏置正则。（null by default）
    //   activity_regularizer?: string // 该层的输出(激活函数输出)正则。（null by default）
    //   kernel_constraint?: string // 权重限制，比如限制为非负等等。（null by default）
    //   bias_constraint?: string // 偏置限制。（null by default）
    // }[]

    // 算法配置
    loss: string // 损失函数
    optimizer: string // 优化算法名。（eg：Adam）
    learningRate: number // 学习率
  }

  // 逻辑回归配置
  type LogisticRegressionSettings = {
    // 通用
    maxIter: number // default 100
    batchSize: number
    optimizer: string
    learningRate: number
    penalty: string // L1 or L2，default L2
    earlyStop: string // 判断是否收敛的方式 diff，weight_diff，abs。 default diff
    alpha: number // 正则强度系数，default 1.0
    decay: number // 学习率衰减系数，默认为1 （lr=lr0/1+decay*t，t为迭代次数）

    // homo
    aggregateIters: number // 多少次迭代聚合一次
    useProximal: boolean // 是否开启近端项 default False 更多细节参考 https://arxiv.org/abs/1812.06127
    mu: number // 近端项的缩放系数 default 0.1
  }

  // [Return]:任务创建/训练（异步运行，轮训调用获取模型创建/训练结果）
  type Callback = {
    queryURL: string
  }

  // [Params]:任务接收
  type TaskAcceptParams = {
    modelID: string
    trainFile: UploadRawFile
    evaluateFile: UploadRawFile
  }

  // [Params]:任务训练
  type TaskTrainParams = {
    modelID: string
    modelAndEvaluation: any
  }
}
