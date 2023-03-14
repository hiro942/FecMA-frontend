<template>
  <n-modal
    class="w-[800px]"
    title="更新当前层配置"
    type="warning"
    v-model:show="layerStore.showUpdateLayerModal"
    preset="dialog"
  >
    <n-divider />
    <Dense
      v-if="layerStore.updateLayerName === 'Dense'"
      :dense="layerStore.totalLayers[layerStore.updateLayerIndex]"
    />
    <Dropout
      v-if="layerStore.updateLayerName === 'Dropout'"
      :dropout="layerStore.totalLayers[layerStore.updateLayerIndex]"
    />
    <LSTM
      v-if="layerStore.updateLayerName === 'LSTM'"
      :lstm="layerStore.totalLayers[layerStore.updateLayerIndex]"
    />
  </n-modal>
</template>

<script setup lang="ts">
import useLayerStore from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/layer'
import Dense from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/Dense.vue'
import Dropout from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/Dropout.vue'
import LSTM from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/LSTM.vue'

const layerStore = useLayerStore()
</script>