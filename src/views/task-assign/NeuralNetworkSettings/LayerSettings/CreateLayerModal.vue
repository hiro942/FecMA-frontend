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

const layerStore = useLayerStore()

const handleNewLayer = () => {
  const newLayer = {}
  switch (layerStore.createLayerName) {
    case 'Dense':
      Object.assign(newLayer, layerStore.dense)
      break
    case 'Dropout':
      Object.assign(newLayer, layerStore.dropout)
      break
    case 'LSTM':
      Object.assign(newLayer, layerStore.lstm)
      break
    default:
      break
  }
  layerStore.totalLayers.push(newLayer)
}
</script>