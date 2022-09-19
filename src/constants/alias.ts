/*
  别名配置
 */

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

  currentNumber: '当前边缘节点数',
  numberOfPeers: '边缘节点数阈值',
  peersRatio: '接收方',

  state: '任务状态',
  timeLimit: '参与截止日期',
  description: '参与要求',

  // partition: '文件分块',

  trainFile: '训练数据文件',
  evaluateFile: '测试数据文件',

  participateDateTime: '参与时间',

  ALL: { text: '所有任务', type: '' },
  ASSIGNED: { text: '待开始', type: 'info' },
  TRAINED: { text: '进行中', type: 'danger' },
  FINISHED: { text: '已完成', type: 'success' },

  /* 模型配置 */
  maxIter: '模型迭代次数',
  batchSize: '批量大小',
  loss: '损失函数',
  optimizer: '优化算法',
  learningRate: '学习率',
  penalty: '正则化策略',
  earlyStop: 'Early-Stop策略',
  decay: '学习率衰减系数',
}
