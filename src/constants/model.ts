/*
  模型配置
 */

// 模型名
export const modelNames = {
  secureBoost: 'HomoSecureboost',
  neuralNetwork: 'Homo_nn',
  logisticRegression: 'Homo_lr',
}

// 开关选项
export const switchOptions = [
  { value: false, label: '否' },
  { value: true, label: '是' },
]

// 模型选项
export const modelOptions = [
  { value: modelNames.secureBoost, label: 'secureBoost' },
  { value: modelNames.neuralNetwork, label: '神经网络' },
  { value: modelNames.logisticRegression, label: '逻辑回归' },
]

// 损失函数选项
export const lossOptions = [
  { value: 'binary_crossentropy', label: 'Binary Cross Entropy' },
  { value: 'categorical_crossentropy', label: 'Categorical Cross Entropy' },
  { value: 'categorical_hinge', label: 'Categorical Hinge' },
  { value: 'cosine_similarity', label: 'Cosine Similarity' },
  { value: 'hinge', label: 'Hinge' },
  { value: 'logcosh', label: 'Log Cosh' },
  { value: 'mean_absolute_error', label: 'Mean Absolute Error' },
  {
    value: 'mean_absolute_percentage_error',
    label: 'Mean Absolute Percentage Error',
  },
  { value: 'mean_squared_error', label: 'Mean Squared Error' },
  {
    value: 'mean_squared_logarithmic_error',
    label: 'Mean Squared Logarithmic Error',
  },
  { value: 'poisson', label: 'Poisson' },
]

// 优化器选项
export const optimizerOptions = {
  nn: [
    { value: 'Adadelta', label: 'Adadelta' },
    { value: 'Adagrad', label: 'Adagrad' },
    { value: 'Adam', label: 'Adam' },
    { value: 'Adamax', label: 'Adamax' },
    { value: 'Nadam', label: 'Nadam' },
    { value: 'Ftrl', label: 'Ftrl' },
    { value: 'RMSProp', label: 'RMSProp' },
    { value: 'SGD', label: 'SGD' },
  ],
  lr: [
    { value: 'SGD', label: 'SGD' },
    { value: 'RMSProp', label: 'RMSProp' },
    { value: 'Adam', label: 'Adam' },
    { value: 'Adagrad', label: 'Adagrad' },
    { value: 'Nesterov Momentum', label: 'Nesterov Momentum' },
  ],
}

// 正则选项
export const penaltyOptions = {
  lr: [
    { value: 'L1', label: 'L1' },
    { value: 'L2', label: 'L2' },
  ],
}

export const earlyStopOptions = {
  lr: [
    { value: 'diff', label: '损失值变化趋于零' },
    { value: 'abs', label: '损失值绝对值变化趋于零' },
    { value: 'weight_diff', label: '模型权重变化趋于零' },
  ],
}
