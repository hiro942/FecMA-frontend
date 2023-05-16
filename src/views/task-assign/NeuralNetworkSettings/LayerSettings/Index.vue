<template>
  <n-h5>当前网络结构</n-h5>
  <n-alert type="info"> 点击卡片可进行修改</n-alert>
  <n-divider />
  <n-empty v-if="!layerStore.totalLayers.length" class="text-center">
    暂无相关配置信息，请点击"添加"按钮
  </n-empty>
  <n-list v-else hoverable clickable class="border-black">
    <n-list-item v-for="(layer, index) in layerStore.totalLayers" :key="index">
      <n-thing
        :title="index + 1 + ': ' + layer.class_name"
        content-style="margin-top: 10px;"
        @click="handleShowUpdateLayerModal(layer, index)"
      >
        <div v-if="layer.class_name === 'Dense'">
          <div>神经元：{{ layer.units }}</div>
          <div>激活函数：{{ layer.activation }}</div>
        </div>
        <div v-if="layer.class_name === 'Dropout'">
          <div>丢弃率：{{ layer.rate }}</div>
        </div>
        <div v-if="layer.class_name === 'LSTM'">
          <div>神经元：{{ layer.units }}</div>
        </div>
      </n-thing>
      <template #suffix>
        <n-button @click="removeLayer" type="error">
          <template #icon>
            <n-icon>
              <TrashBinOutline />
            </n-icon>
          </template>
        </n-button>
      </template>
    </n-list-item>
  </n-list>
  <n-divider />

  <!--  新增layer按钮-->
  <n-button
    class="w-full mt-3"
    type="success"
    @click="handleShowCreateLayerModal"
  >
    添加
  </n-button>

  <!--  新增layer的模态框-->
  <NewLayerModal />

  <!--  更新layer的模态框-->
  <UpdateLayerModal />
</template>

<script setup lang="ts">
import { TrashBinOutline } from '@vicons/ionicons5'
import NewLayerModal from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/CreateLayerModal.vue'
import UpdateLayerModal from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/UpdateLayerModal.vue'
import useLayerStore from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/layer'

const removeLayer = (e: MouseEvent) => {
  e.preventDefault()
  layerStore.totalLayers.splice(layerStore.updateLayerIndex, 1)
}

const layerStore = useLayerStore()

const handleShowCreateLayerModal = () => {
  layerStore.showCreateLayerModal = true
}
const handleShowUpdateLayerModal = (layer: any, index: number) => {
  layerStore.updateLayerName = layer.class_name
  layerStore.updateLayerIndex = index
  layerStore.showUpdateLayerModal = true
}
</script>