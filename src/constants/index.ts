export const APP_NAME = 'Psssssssst'

export const DEFAULT_AVATAR =
  'https://img-qn.51miz.com/Element/00/88/60/42/ea5b40df_E886042_1992a532.png!/quality/90/unsharp/true/compress/true/format/png/fw/300'

// 邮箱格式
export const EmailRegExp = /^[a-zA-z\d._-]+@[a-zA-z\d]+.[a-zA-z\d]+/

// 密码为字母（大小写均可）和数字的组合
export const PasswordRegExp = /[a-zA-z\d]+/

// 昵称/名称为任意表意文字
export const NameRegExp = /[\p{Unified_Ideograph}a-zA-Z\d]+/u

// 别名配置
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

  currentNumber: '当前节点数',
  numberOfPeers: '参与节点数',
  peersRatio: '参与方',

  state: '任务状态',
  timeLimit: '任务开始时间',
  description: '任务描述',

  // partition: '文件分块',

  trainFile: '训练数据文件',
  evaluateFile: '测试数据文件',

  participateDateTime: '参与时间',

  ALL: { text: '所有任务', type: '' },
  ASSIGNED: { text: '待开始', type: 'info' },
  TRAINED: { text: '进行中', type: 'danger' },
  FINISHED: { text: '已完成', type: 'success' },
}
