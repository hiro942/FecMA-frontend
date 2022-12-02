<template>
  <div v-if="models">
    <n-grid
      v-if="models.length"
      x-gap="24"
      y-gap="24"
      cols="1 620:2 1000:3"
      style="max-width: 1080px; margin: auto"
    >
      <n-gi v-for="(model, index) in models" :key="index">
        <n-grid
          class="model-card"
          x-gap="24"
          y-gap="24"
          cols="1"
          @click="openModelInferenceModal(model)"
        >
          <n-gi style="font-size: x-large; font-weight: bold">
            {{ model.taskName }}
          </n-gi>
          <n-gi>
            <n-space class="inner-card" vertical justify="space-between">
              <n-grid cols="2" x-gap="24">
                <n-gi>
                  <n-icon :component="CubeOutline" />
                  模型名称
                </n-gi>
                <n-gi>{{ model.modelName }}</n-gi>
              </n-grid>

              <n-grid cols="2" x-gap="24">
                <n-gi>
                  <n-icon :component="PeopleOutline" />
                  参与节点
                </n-gi>
                <n-gi>{{ model.currentPeers }}</n-gi>
              </n-grid>
            </n-space>
          </n-gi>
          <n-gi>
            <n-space justify="space-between" align="center">
              <div>
                <n-icon :component="TimeOutline" />
                {{ model.assignDateTime.slice(0, 10) }}
              </div>
            </n-space>
          </n-gi>
        </n-grid>
      </n-gi>
    </n-grid>
    <n-empty v-else description="暂无可用模型" style="margin-top: 100px" />

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
import useGlobalStateStore from '@/store/modules/globalState'
import InferenceModal from '@/views/inference/components/InferenceModal.vue'

const globalStateStore = useGlobalStateStore()

const models = ref<FLearningModels.Model[]>()
onBeforeMount(async () => {
  models.value = await fetchModelList()
})

const selectedModel = ref()

const openModelInferenceModal = (model: FLearningModels.Model) => {
  selectedModel.value = model
  globalStateStore.inferenceModalVisible = true
}
</script>

<style scoped lang="scss">
.model-card {
  background: rgb(202, 237, 255);
  padding: 30px;
  border-radius: 0.3rem;
  cursor: pointer;
  position: relative;
  top: 0;
  box-shadow: 0.1rem 0.3rem 0.5rem rgba(0, 0, 0, 0.1);
  &:hover {
    top: -0.25rem;
    box-shadow: none;
  }
  transition: all 0.5s ease-out;

  .inner-card {
    height: 100%;
    border: 1px rgba(205, 205, 0, 0.3) solid;
    padding: 20px;
    border-radius: 10px;
    background-color: rgb(222, 247, 254);
  }
}

.n-icon {
  // 图标与内容对齐
  vertical-align: -15%;
}
</style>
