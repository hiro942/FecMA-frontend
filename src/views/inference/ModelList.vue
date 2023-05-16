<template>
  <div>
    <n-card v-if="models">
      <n-grid
        x-gap="24"
        y-gap="24"
        cols="1 620:2 1000:3"
        style="max-width: 1080px;"
      >
        <n-gi v-for="(model, index) in models" :key="index">
          <n-card
            embedded
            hoverable
            :bordered="false"
            :title="model.taskName"
            :segmented="{
              content: true,
              footer: 'soft',
            }"
          >
            <template #header-extra>ID: {{ model.modelID }}</template>
            <div>模型名称：{{ modelNamesMapCN[model.modelName] }}</div>
            <div>参与节点：{{ model.currentPeers }}</div>
            <!--            <div>准确率：{{ model.accuracy || '无' }}</div>-->
            <template #footer>
              <n-space justify="space-between" align="center">
                <div>
                  {{ dayjs(model.assignDateTime).format('YYYY-MM-DD HH:mm') }}
                </div>
                <n-button size="small" @click="openModelInferenceModal(model)"
                  >推理
                </n-button>
              </n-space>
            </template>
          </n-card>
        </n-gi>
      </n-grid>
      <n-empty
        v-if="models && !models.length"
        class="mt-16"
        description="暂无可用模型"
      />
    </n-card>

    <InferenceModal
      v-if="globalStateStoreStore.inferenceModalVisible"
      :model="selectedModel"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { fetchModelList } from '@/api/fLearning'
import useGlobalStateStore from '@/store/globalState'
import InferenceModal from '@/views/inference/InferenceModal.vue'
import { useMessage } from 'naive-ui'
import { modelNamesMapCN } from '@/configs/maps'
import dayjs from 'dayjs'
import { ipv6TaskFilter, normalTaskFilter } from '@/utils/filters'

const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

const models = ref<FLearningModels.Model[]>()
onBeforeMount(async () => {
  try {
    models.value = await fetchModelList()
    models.value = normalTaskFilter(models.value)
  } catch (err: any) {
    message.error(err.message)
  }
})

const selectedModel = ref()

const openModelInferenceModal = (model: FLearningModels.Model) => {
  selectedModel.value = model
  globalStateStoreStore.inferenceModalVisible = true
}
</script>