/*
  模型配置
 */

export const modelName = {
  secureboost: 'HomoSecureboost',
  neuralNetwork: 'Homo_nn',
  logisticRegression: 'Homo_lr',
}

// 模型选择项
export const modelOptions = [
  { value: modelName.secureboost, label: 'secureboost' },
  { value: modelName.neuralNetwork, label: '神经网络' },
  { value: modelName.logisticRegression, label: '逻辑回归' },
]

// 损失函数配置项
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

// 优化算法配置项
export const optimizerOptions = [
  { value: 'Adadelta', label: 'Adadelta' },
  { value: 'Adagrad', label: 'Adagrad' },
  { value: 'Adam', label: 'Adam' },
  { value: 'Adamax', label: 'Adamax' },
  { value: 'Nadam', label: 'Nadam' },
  { value: 'Ftrl', label: 'Ftrl' },
  { value: 'RMSprop', label: 'RMSprop' },
  { value: 'SGD', label: 'SGD' },
]

// 逻辑回归支持的优化器
// sgd，rmsprop， adam， adagrad， nesterov_momentum_sgd
