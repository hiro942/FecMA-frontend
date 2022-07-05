export const APP_NAME = 'Psssssssst'

export const DEFAULT_AVATAR = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh0tJhJWjd5dacn4jpGOtqtCs-qvW5u4xGYg&usqp=CAU'

export const DEFAULT_NICKNAME = 'hiro942'

// 邮箱格式
export const EmailRegExp = /^[a-zA-z\d._-]+@[a-zA-z\d]+.[a-zA-z\d]+/

// 密码为字母（大小写均可）和数字的组合
export const PasswordRegExp = /[a-zA-z\d]+/

// 昵称为任意表意文字
export const NameRegExp = /[\p{Unified_Ideograph}a-zA-Z\d]+/u

// 别名配置
export const AliasCN: any = {
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

  nickname: '用户名',
  partyID: '组织ID',
  participateDateTime: '参与时间',

  ASSIGNED: { text: '待开始', type: 'info' },
  TRAINED: { text: '进行中', type: 'danger' },
  FINISHED: { text: '已完成', type: 'success' },
}
