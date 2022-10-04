<template>
  <div class="recommend-list">
    <div class="title">任务推荐</div>
    <el-button class="update-batch-btn" @click="changeTaskBatch">
      换一批
    </el-button>
    <el-input
      v-model="searchContent"
      class="search-bar"
      placeholder="按任务名搜索"
    >
      <template #append>
        <el-button :icon="Search" @click="searchTask" />
      </template>
    </el-input>
    <div
      v-for="(task, index) in recommendTasks"
      :key="index"
      class="recommend-item"
      @click="viewRecommendTask(task.taskName)"
    >
      {{ task.taskName }} ({{ task.currentNumber }}/{{ task.numberOfPeers }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import router from '@/router'
import { Search } from '@element-plus/icons-vue'
import useGlobalStateStore from '@/store/modules/globalState'
import { fetchAllTask } from '@/api/fLearning'

const taskListStateStore = useGlobalStateStore() // [store] 任务列表状态仓库

const searchContent = ref('') // [Recommend] 搜索词
const allTasks = ref()
onBeforeMount(async () => {
  allTasks.value = await fetchAllTask()
})

// [Recommend] 获取一批新的推荐任务
const getNewRecommendBatch = () => {
  const batchSize = Math.min(7, allTasks.value.length)
  const newBatch = []
  for (let i = 0; i < batchSize; i += 1) {
    const index = Math.floor(Math.random() * allTasks.value.length)
    const newTask = (allTasks as any)[index]
    newBatch.push(newTask)
  }
  return newBatch
}

// [Recommend] 推荐任务
const recommendTasks = ref<FLearningModels.Task[]>(getNewRecommendBatch())

// [Recommend] 更换推荐批次
const changeTaskBatch = () => {
  recommendTasks.value = getNewRecommendBatch()
}

// [Recommend] 搜索任务
const searchTask = () => {
  taskListStateStore.searchTaskName = searchContent.value
  router.push({ name: 'AllTask' })
}

// [Recommend] 查看某一推荐任务
const viewRecommendTask = (taskName: string) => {
  taskListStateStore.searchTaskName = taskName
  router.push({ name: 'AllTask' })
}
</script>

<style scoped lang="scss">
.recommend-list {
  padding: 0px;
  // border: 1px solid yellowgreen;

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
    margin-top: 10px;
    padding: 5px 0;
    border: 2px solid black;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
      background-color: pink;
    }
  }
}
</style>
