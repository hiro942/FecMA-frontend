<template>
  <n-modal
    v-model:show="globalStateStore.taskResultModalVisible"
    preset="dialog"
    title="训练结果"
    type="success"
    style="width: 100vw; min-height: 100vh"
  >
    <div class="task-result">
      <h2>模型名</h2>
      <div class="task-result-tab">
        <!--        <el-button-group>-->
        <!--          <el-button-->
        <!--            v-for="tabLabel in tabLabels"-->
        <!--            :key="tabLabel"-->
        <!--            class="tab-item"-->
        <!--            :class="tabLabel === activeTab ? 'active-tab-item' : ''"-->
        <!--            @click="activeTab = tabLabel"-->
        <!--          >-->
        <!--            {{ tabLabel }}-->
        <!--          </el-button>-->
        <!--        </el-button-group>-->
        <el-button
          :icon="Download"
          class="download-btn"
          size="large"
          @click="handleDownloadModel"
        >
          Download
        </el-button>
      </div>

      <el-divider />
      <Metrics />
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import DataOutput from '@/views/task-list/components/TaskResultModal/components/DataOutput.vue'
import ModelOutput from '@/views/task-list/components/TaskResultModal/components/ModelOutput.vue'
import { ref } from 'vue'
import { downloadModel } from '@/api/fLearning'
import { Download } from '@element-plus/icons-vue'
import useGlobalStateStore from '@/store/modules/globalState'
import { download } from '@/utils/download'
import { useMessage } from 'naive-ui'
import Metrics from '@/views/task-list/components/TaskResultModal/components/Metrics.vue'

const message = useMessage()
const props = defineProps<{ task: FLearningModels.Task; modelInfo: any }>()
const globalStateStore = useGlobalStateStore()
const tabLabels = ['model output', 'data output']
const activeTab = ref('model output')

// 模型下载
const handleDownloadModel = async () => {
  try {
    const data = await downloadModel(props.task.modelID)
    message.success('操作成功，下载即将开始')
    download(data, '模型结果.json')
  } catch (err: any) {
    message.error(err.message)
  }
}
</script>

<style scoped lang="scss">
.task-result {
  padding: 0 30px;
  background-color: white;

  .task-result-tab {
    display: flex;
    margin-bottom: 30px;

    .tab-item {
      height: 100%;
      padding: 0 20px;
      font-weight: bold;
      border-radius: 2px;
      background-color: #eee;
      cursor: pointer;

      &:hover {
        color: #fff;
        background-color: var(--sys-blue);
      }

      &.active-tab-item {
        color: #fff;
        background-color: var(--sys-blue);
      }
    }

    .download-btn {
      font-weight: bold;
      border: 2px solid black;
      color: var(--sys-blue);
      background-color: #fff;
      &:hover {
        background-color: pink;
      }
    }
  }
}
</style>
