<template>
  <div class="recommend-list">
    <div class="title">任务推荐</div>
    <el-button class="update-batch-btn" @click="changeTaskBatch">
      换一批
    </el-button>
    <el-input
      v-model:value="searchContent"
      class="search-bar"
      placeholder="按任务名搜索"
    >
      <template #append>
        <el-button :icon="Search" @click="searchTask" />
      </template>
    </el-input>
    <n-grid cols="3" :y-gap="24" :x-gap="24">
      <n-gi
        v-for="(task, index) in recommendTasks"
        :key="index"
        class="recommend-item"
        @click="viewRecommendTask(task.taskName)"
      >
        <n-space
          style="height: 100%"
          vertical
          align="center"
          justify="space-around"
        >
          <n-h4>
            <n-ellipsis style="max-width: 100px">
              {{ task.taskName }}
            </n-ellipsis>
          </n-h4>
          <div>
            <div style="font-size: 14px; display: flex; align-items: center">
              <n-icon><BatteryHalf /></n-icon>
              <div style="margin-left: 5px">
                当前参与: {{ task.currentPeers }}
              </div>
            </div>
            <div
              style="
                font-size: 14px;
                display: flex;
                align-items: center;
                margin-top: 10px;
              "
            >
              <n-icon><BatteryFullOutline /></n-icon>
              <div style="margin-left: 5px">最少参与: {{ task.minPeers }}</div>
            </div>
          </div>
        </n-space>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import useGlobalStateStore from '@/store/modules/globalState'
import { fetchAllTask } from '@/api/fLearning'
import { BatteryFullOutline, BatteryHalf } from '@vicons/ionicons5'

const router = useRouter()
const globalStateStore = useGlobalStateStore()

const allTasks = ref<FLearningModels.Task[]>([])

// [Recommend] 获取一批新的推荐任务
const getNewRecommendBatch = () => {
  const batchSize = Math.min(3, allTasks.value.length)
  const newBatch = []
  for (let i = 0; i < batchSize; i += 1) {
    const index = Math.floor(Math.random() * allTasks.value.length)
    const newTask = allTasks.value[index]
    newBatch.push(newTask)
  }
  return newBatch
}

const searchContent = ref('')
const recommendTasks = ref()

onBeforeMount(async () => {
  allTasks.value = await fetchAllTask()
  recommendTasks.value = getNewRecommendBatch()
})

// [Recommend] 更换推荐批次
const changeTaskBatch = () => {
  recommendTasks.value = getNewRecommendBatch()
}

// [Recommend] 搜索任务
const searchTask = () => {
  globalStateStore.searchTaskName = searchContent.value
  router.push({ name: 'TaskExplore' })
}

// [Recommend] 查看某一推荐任务
const viewRecommendTask = (taskName: string) => {
  globalStateStore.searchTaskName = taskName
  router.push({ name: 'TaskExplore' })
}
</script>

<style scoped lang="scss">
.recommend-list {
  .title {
    font-weight: bold;
    font-size: large;
    float: left;
  }
  .update-batch-btn {
    float: right;
  }
  .search-bar {
    margin: 10px 0;
  }
  .recommend-item {
    height: 160px;
    margin-top: 20px;
    padding: 5px;
    border-top: 5px solid rgb(150, 150, 255);
    border-radius: 5px;
    cursor: pointer;
    background-color: rgb(242, 247, 254);
    &:hover {
      background-color: rgb(222, 237, 255);
    }
  }
}
</style>
