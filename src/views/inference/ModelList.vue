<template>
  <div>
    <n-grid
      v-if="models.length"
      x-gap="24"
      y-gap="24"
      cols="1 620:2 1000:3"
      style="max-width: 1080px; margin: auto"
    >
      <n-gi v-for="(model, index) in models" :key="index">
        <n-card
          class="hover:cursor-pointer"
          embedded
          hoverable
          :title="model.taskName"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
          @click="openModelInferenceModal(model)"
        >
          <template #header-extra>ID: {{ model.modelID }} </template>
          <div>模型名称：{{ model.modelName }}</div>
          <div>参与节点：{{ model.currentPeers }}</div>
          <template #footer>
            {{ dayjs(model.assignDateTime).format('YYYY-MM-DD HH:MM') }}
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <n-empty v-else class="mt-16" description="暂无可用模型" />

    <InferenceModal
      v-if="globalStateStore.inferenceModalVisible"
      :model="selectedModel"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { fetchModelList } from '@/api/fLearning'
import { CubeOutline, TimeOutline, PeopleOutline } from '@vicons/ionicons5'
import useGlobalStateStore from '@/store/globalState'
import InferenceModal from '@/views/inference/InferenceModal.vue'
import dayjs from 'dayjs'

const globalStateStore = useGlobalStateStore()

const models = ref<FLearningModels.Model[]>([])
onBeforeMount(async () => {
  models.value = await fetchModelList()
})

const selectedModel = ref()

const openModelInferenceModal = (model: FLearningModels.Model) => {
  selectedModel.value = model
  globalStateStore.inferenceModalVisible = true
}
</script>
