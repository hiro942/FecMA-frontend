<template>
  <div>
    <n-grid
      x-gap="24"
      y-gap="24"
      cols="1 400:2"
      style="max-width: 1000px; margin: auto"
    >
      <n-gi v-for="(model, index) in models" :key="index">
        <div class="model-card" @click="handleModelInference">
          <n-grid x-gap="24" cols="5">
            <n-gi span="2">
              <n-space style="height: 100%" vertical justify="space-between">
                <div style="font-size: x-large; font-weight: bold">
                  {{ model.taskName }}
                </div>
                <n-space align="center">
                  <n-avatar :src="model.assigner.avatarUrl" round />
                  <div>{{ model.assigner.nickname }}</div>
                </n-space>
              </n-space>
            </n-gi>

            <n-gi span="3">
              <n-space class="inner-card" vertical justify="space-between">
                <n-grid cols="2" x-gap="24">
                  <n-gi>
                    <n-icon :component="CubeOutline" />
                    模型名
                  </n-gi>
                  <n-gi>{{ model.modelName }}</n-gi>
                </n-grid>

                <n-grid cols="2" x-gap="24">
                  <n-gi>
                    <n-icon :component="PeopleOutline" />
                    参与方
                  </n-gi>
                  <n-gi>{{ model.currentPeers }}</n-gi>
                </n-grid>

                <n-grid cols="2" x-gap="24">
                  <n-gi>
                    <n-icon :component="BarChartOutline" />
                    数据量
                  </n-gi>
                  <n-gi>{{ model.dataAmount }}</n-gi>
                </n-grid>

                <n-grid v-if="model.error" cols="2" x-gap="24">
                  <n-gi>
                    <n-icon :component="TrendingDown" />
                    测试误差
                  </n-gi>
                  <n-gi>{{ model.error.toFixed(2) }}</n-gi>
                </n-grid>

                <n-grid v-if="model.accuracy" cols="2" x-gap="24">
                  <n-gi>
                    <n-icon :component="TrendingUp" />
                    测试精度
                  </n-gi>
                  <n-gi>{{ model.accuracy.toFixed(2) }}</n-gi>
                </n-grid>
              </n-space>
            </n-gi>
          </n-grid>
        </div>
      </n-gi>
    </n-grid>

    <InferenceModal v-if="globalStateStore.inferenceModalVisible" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { fetchModelList } from '@/api/fLearning'
import {
  CubeOutline,
  TrendingUp,
  TrendingDown,
  BarChartOutline,
  PeopleOutline,
} from '@vicons/ionicons5'
import useGlobalStateStore from '@/store/modules/globalState'
import InferenceModal from '@/views/inference/components/InferenceModal.vue'

const globalStateStore = useGlobalStateStore()

const models = ref<FLearningModels.Model[]>([])
onBeforeMount(async () => {
  models.value = await fetchModelList()
})

const handleModelInference = () => {
  globalStateStore.inferenceModalVisible = true
}
</script>

<style scoped lang="scss">
.model-card {
  background-color: rgba(0, 0, 255, 0.5);
  padding: 30px;
  color: white;
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
    //background: pink;
    background-color: rgba(0, 0, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
  }
}
</style>
