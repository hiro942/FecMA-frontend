<template>
  <n-modal
    class="w-[800px]"
    title="添加层"
    v-model:show="layerStore.showCreateLayerModal"
    preset="dialog"
    positive-text="添加"
    negative-text="取消"
    @positive-click="handleNewLayer"
  >
    <n-divider />
    <n-popselect
      v-model:value="layerStore.createLayerName"
      :options="layerStore.layerOptions"
      size="large"
    >
      <n-button class="w-full" type="success" secondary>
        {{ layerStore.createLayerName || '选择网络层结构' }}
      </n-button>
    </n-popselect>

    <n-divider />
    <Dense
      v-if="layerStore.createLayerName === 'Dense'"
      :dense="layerStore.dense"
    />
    <Dropout
      v-if="layerStore.createLayerName === 'Dropout'"
      :dropout="layerStore.dropout"
    />
    <LSTM
      v-if="layerStore.createLayerName === 'LSTM'"
      :lstm="layerStore.lstm"
    />
  </n-modal>
</template>

<script setup lang="ts">
import Dense from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/Dense.vue'
import Dropout from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/Dropout.vue'
import LSTM from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/LSTM.vue'
import useLayerStore from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/layer'
import { useMessage } from 'naive-ui'

const layerStore = useLayerStore()
const message = useMessage()

const handleNewLayer = () => {
  let newLayer: any = {}
  switch (layerStore.createLayerName) {
    case 'Dense':
      if (!checkNewLayerForm(layerStore.dense)) {
        return false
      }
      Object.assign(newLayer, layerStore.dense)
      break
    case 'Dropout':
      if (!checkNewLayerForm(layerStore.dropout)) {
        return false
      }
      Object.assign(newLayer, layerStore.dropout)
      break
    case 'LSTM':
      if (!checkNewLayerForm(layerStore.lstm)) {
        return false
      }
      Object.assign(newLayer, layerStore.lstm)
      break
    default:
      message.info('请先选择需要添加的层结构')
      return false
  }
  newLayer.name += '_' + layerStore.totalLayers.length.toString()
  console.log(newLayer)
  layerStore.totalLayers.push(newLayer)
}

const checkNewLayerForm = (layerInfo: any): boolean => {
  for (let key in layerInfo) {
    const val = layerInfo[key]
    if (val === null || val === '') {
      // dense 层若不使用 bias，则无需检查 bias 的初始化选择
      if (
        layerInfo.class_name === 'Dense' &&
        key === 'bias_initializer' &&
        !layerInfo.use_bias
      ) {
        continue
      }
      message.warning('请填写完整表单')
      return false
    }
  }
  return true
}
</script>