<template>
  <div class="card-list">
    <div
      v-for="(state, index) in taskState"
      :key="index"
      class="card-item"
      :style="{ borderColor: cardsStyle[index].color }"
    >
      <div>
        <el-icon :color="cardsStyle[index].color" size="32px">
          <component :is="cardsStyle[index].icon" />
        </el-icon>
      </div>
      <div class="card-number">{{ state.number }}</div>
      <div class="card-state">{{ AliasCN[state.name].text }}</div>
      <div
        class="card-footer"
        :style="{ backgroundColor: cardsStyle[index].color }"
      >
        <span @click="viewTasksByState(state.name)">View Detail</span>
        <el-icon><DArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import {
  AlarmClock,
  DataAnalysis,
  ElementPlus,
  Monitor,
  DArrowRight,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import useGlobalStateStore from '@/store/modules/globalState'
import { fetchMyTask } from '@/api/fLearning'
import { AliasCN } from '@/constants/alias'

const router = useRouter()
const globalStateStore = useGlobalStateStore() // [store] 任务列表状态仓库
const myTasks = ref<FLearningModels.Task[]>([])
onBeforeMount(async () => {
  myTasks.value = await fetchMyTask()
})

// [Cards] 样式
const cardsStyle = [
  { color: 'rgb(165, 219, 203)', icon: Monitor },
  { color: 'rgb(243, 225, 171)', icon: ElementPlus },
  { color: 'rgb(166, 219, 243)', icon: AlarmClock },
  { color: 'rgb(235, 188, 188)', icon: DataAnalysis },
]

// [Cards] 状态卡片数据
const taskState = computed(() => {
  let assigned = 0
  let trained = 0
  let finished = 0
  myTasks.value.forEach((task: FLearningModels.Task) => {
    if (task.state === 'ASSIGNED') {
      assigned += 1
    } else if (task.state === 'TRAINED') {
      trained += 1
    } else if (task.state === 'FINISHED') {
      finished += 1
    }
  })

  return [
    { name: 'ALL', number: myTasks.value.length },
    { name: 'ASSIGNED', number: assigned },
    { name: 'TRAINED', number: trained },
    { name: 'FINISHED', number: finished },
  ]
})

// [Cards] 查看特定状态的任务
const viewTasksByState = (stateName: string) => {
  if (stateName !== 'ALL') {
    globalStateStore.filterTaskState = stateName
  }
  router.push({ name: 'MyTask' })
}
</script>

<style scoped lang="scss">
.card-list {
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: repeat(4, 1fr);
  .card-item {
    text-align: center;
    padding-top: 15px;
    border-radius: 5px;
    border: 2px solid;
    .card-number {
      font-weight: bold;
      font-size: 30px;
    }

    .card-state {
      font-size: small;
    }
    .card-footer {
      margin-top: 10px;
      padding: 5px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      font-weight: bold;

      span {
        margin-right: 5px;
      }
    }
  }
}
</style>
