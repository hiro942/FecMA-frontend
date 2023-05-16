import { defineStore } from 'pinia'

const useLayerStore = defineStore('layer', () => {
  const createLayerName = ref<string | null>(null)
  const updateLayerName = ref<string | null>(null)
  const updateLayerIndex = ref(-1)
  const showCreateLayerModal = false
  const showUpdateLayerModal = false

  const totalLayers: any[] = [
    // {
    //   class_name: 'Dense',
    //   name: 'dense',
    //   units: 16,
    //   activation: 'sigmoid',
    //   use_bias: 1,
    //   kernel_initializer: 'GlorotUniform',
    //   bias_initializer: 'Zeros',
    // },
    // {
    //   class_name: 'Dense',
    //   name: 'dense_1',
    //   units: 16,
    //   activation: 'sigmoid',
    //   use_bias: 1,
    //   kernel_initializer: 'GlorotUniform',
    //   bias_initializer: 'Zeros',
    // },
  ]

  const dense = {
    class_name: 'Dense',
    name: 'dense',
    units: null,
    activation: null,
    use_bias: null,
    kernel_initializer: null,
    bias_initializer: null,
    // kernel_regularizer: null,
    // bias_regularizer: null,
    // activity_regularizer: null,
  }

  const dropout = {
    class_name: 'Dropout',
    name: 'dropout',
    rate: 0.1,
  }

  const lstm = {
    class_name: 'LSTM',
    name: 'lstm',
    units: null,
  }

  const layerOptions = [
    { value: 'Dense', label: 'Dense 全连接层' },
    { value: 'Dropout', label: 'Dropout 丢弃层' },
    { value: 'LSTM', label: 'LSTM 层' },
    // { value: 'embedding', label: 'embedding' }
  ]

  const kernelInitOptions = [
    { value: 'GlorotNormal', label: 'Xavier正态分布初始化' },
    { value: 'GlorotUniform', label: 'Xavier均匀分布初始化' },
    { value: 'RandomNormal', label: '随机正态分布初始化' },
    { value: 'RandomUniform', label: '随机均匀分布初始化' },
    { value: 'HeNormal', label: 'He正态分布初始化' },
    { value: 'HeUniform', label: 'He均匀分布初始化' },
    { value: 'LecunNormal', label: 'LeCun正态分布初始化' },
    { value: 'LecunUniform', label: 'LeCun均匀分布初始化' },
  ]

  const biasInitOptions = [
    { value: 'Zeros', label: '全零初始化' },
    { value: 'Ones', label: '全1初始化' },
    { value: 'RandomNormal', label: '随机正态分布初始化' },
  ]

  const activationOptions = [
    { value: 'softmax', label: 'softmax' },
    { value: 'relu', label: 'relu' },
    { value: 'sigmoid', label: 'sigmoid' },
    { value: 'tanh', label: 'tanh' },
    { value: 'linear', label: 'linear' },
  ]

  return {
    totalLayers,
    createLayerName,
    updateLayerName,
    updateLayerIndex,
    showCreateLayerModal,
    showUpdateLayerModal,
    dense,
    dropout,
    lstm,
    layerOptions,
    kernelInitOptions,
    biasInitOptions,
    activationOptions,
  }
})

export default useLayerStore
