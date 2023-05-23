// 中文名称映射
export const AliasCN: any = {
  nickname: '用户名',
  email: '邮箱',
  avatarUrl: '头像',
  role: '角色',
  partyID: 'FATE参与方ID',
  org: '组织',
  user: '普通用户',

  assigner: '创建人',
  assignDateTime: '创建时间',
  createTime: '创建时间',

  taskID: '任务ID',
  taskName: '任务名称',
  modelID: '模型ID',
  modelName: '模型名称',

  currentPeers: '当前参与方',

  state: '任务状态',
  timeLimit: '参与截止日期',
  description: '任务描述',

  evalType: '任务类型',
  trainFile: '训练数据文件',
  evaluateFile: '验证数据文件',

  participateDateTime: '参与时间',

  ALL: { text: '所有任务', type: '' },
  ASSIGNED: { text: '待开始', type: 'default' },
  TRAINED: { text: '进行中', type: 'info' },
  FINISHED: {
    text: '已结束',
    SUCCESS: { text: '成功', type: 'success' },
    ERROR: { text: '失败', type: 'error' },
  },

  /* 模型配置 */
  maxIter: '模型迭代次数',
  batchSize: '批量大小',
  loss: '损失函数',
  optimizer: '优化算法',
  learningRate: '学习率',
  penalty: '正则化策略',
  earlyStop: 'Early-Stop策略',
  decay: '学习率衰减系数',

  // 区块信息
  blockNumber: '区块序号',
  channelName: '通道名称',
  blockTransactionCount: '交易数',
  dataHash: '数据哈希',
  currentHash: '区块哈希',
  previousHash: '前一区块哈希',
  transactionInfo: '交易',

  // 交易信息
  transactionID: '交易ID',
  creatorMSP: '创建节点MSP',
  endorser: '背书节点',
  chaincodeName: '链码名称',
}

// 模型名映射
export const modelNamesMap = {
  secureBoost: 'homo_secureboost',
  neuralNetwork: 'homo_nn',
  logisticRegression: 'homo_lr',
}

export const modelNamesMapCN = {
  homo_secureboost: 'Secure Boost',
  homo_nn: '神经网络',
  homo_lr: '逻辑回归',
}

export const modelSettingsMap = {
  INTER_LINEAR: '双线性插值',
  INTER_NEAREST: '最近邻插值',
  INTER_AREA: '像素区域关系重采样',
  INTER_CUBIC: '4*4像素领域的双三次插值',
  INTER_LANCZOS4: '8*8像素领域的Lanczos插值',
}
