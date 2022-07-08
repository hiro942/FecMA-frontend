<template>
  <div class="dashboard">
    <div class="grid-container">
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

      <div class="blockchain-info">区块链信息</div>

      <div id="latest-task-progress-chart"></div>

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
          {{ task.taskName }} ({{ task.currentNumber }}/{{
            task.numberOfPeers
          }})
        </div>
      </div>
    </div>

    <div class="model-list">已有模型</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { AliasCN } from '@/constants'
import router from '@/router'
import {
  AlarmClock,
  DataAnalysis,
  ElementPlus,
  Monitor,
  DArrowRight,
  Search,
} from '@element-plus/icons-vue'
import useGlobalStateStore from '@/store/modules/globalState'
import { fetchAllTask, fetchMyTask } from '@/api/fLearning'
import { off } from 'process'
import { arrayBuffer } from 'stream/consumers'

const globalStateStore = useGlobalStateStore()

const myTasks = await fetchMyTask() // [api] 获取我的任务

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
  myTasks.forEach((task: FLearningAPI.TaskInfo) => {
    if (task.state === 'ASSIGNED') {
      assigned += 1
    } else if (task.state === 'TRAINED') {
      trained += 1
    } else if (task.state === 'FINISHED') {
      finished += 1
    }
  })

  return [
    { name: 'ALL', number: myTasks.length },
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

// [Chart] 最新任务进度信息
const getLatestTask = () => {
  // 按时间排序筛出最近的n个任务
  // TODO: 目前没有 participateTime 这一项，只能根据任务发布时间来做
  myTasks.sort((task1: FLearningAPI.TaskInfo, task2: FLearningAPI.TaskInfo) => {
    const time1 = new Date(task1.assignDateTime).getTime()
    const time2 = new Date(task2.assignDateTime).getTime()
    return time2 - time1
  })
  return myTasks.slice(0, 3)
}

const latestTasks = ref<FLearningAPI.TaskInfo[]>(getLatestTask()) // [Chart] 最近任务
const taskProgressChartDOM = ref() // [Chart] 图表DOM
const taskProgressChart = ref() // [Chart] 图表实例
const searchContent = ref('') // [Recommend] 搜索词

const option = computed(() => ({
  xAxis: {
    name: '任务名',
    type: 'category',
    data: latestTasks.value.map((task) => task.taskName),
    axisTick: {
      alignWithLabel: true,
    },
    axisLine: {
      symbol: ['none', 'arrow'],
    },
  },
  yAxis: {
    name: '任务状态',
    type: 'category',
    data: ['', '待开始', '进行中', '已完成'], // 刻度值
    min: 1, // 坐标轴刻度最小值
    axisTick: {
      alignWithLabel: true, // 刻度与标签对其
    },
    axisLine: {
      symbol: ['none', 'arrow'],
    },
  },
  series: [
    {
      data: latestTasks.value.map((task) => AliasCN[task.state].text),
      type: 'bar',
      barWidth: 50,
      itemStyle: {
        // 每根柱子颜色设置
        color(params: any) {
          // 备用色（蓝）：#0487ED
          const colorList = ['#C0BF49', '#3EB377', '#E8423D']
          return colorList[params.dataIndex]
        },
      },
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
      },
    },
  ],
}))

onMounted(() => {
  // [Chart] 初始化 chart
  taskProgressChartDOM.value = document.getElementById(
    'latest-task-progress-chart',
  )
  taskProgressChart.value = echarts.init(taskProgressChartDOM.value)
  taskProgressChart.value.setOption(option.value)
})

const allTasks = await fetchAllTask() // [api] 获取所有任务

// [Recommend] 获取一批新的推荐任务
const getNewRecommendBatch = () => {
  const batchSize = Math.min(7, allTasks.length)
  const newBatch = []
  for (let i = 0; i < batchSize; i += 1) {
    const index = Math.floor(Math.random() * allTasks.length)
    const newTask = allTasks[index]
    newBatch.push(newTask)
  }
  return newBatch
}

// [Recommend] 推荐任务
const recommendTasks = ref<FLearningAPI.TaskInfo[]>(getNewRecommendBatch())

// [Recommend] 更换推荐批次
const changeTaskBatch = () => {
  recommendTasks.value = getNewRecommendBatch()
}

// [Recommend] 搜索任务
const searchTask = () => {
  globalStateStore.searchTaskName = searchContent.value
  router.push({ name: 'AllTask' })
}

// [Recommend] 查看某一推荐任务
const viewRecommendTask = (taskName: string) => {
  globalStateStore.searchTaskName = taskName
  router.push({ name: 'AllTask' })
}
</script>

<style scoped lang="scss">
.dashboard {
  .grid-container {
    margin-bottom: 30px;
    display: grid;
    grid-column-gap: 30px;
    grid-row-gap: 30px;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: 1fr 3fr;
    .card-list {
      display: grid;
      grid-column-gap: 10px;
      grid-template-columns: repeat(4, 1fr);
      .card-item {
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
    .blockchain-info {
      border: 1px solid yellowgreen;
    }
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
  }

  .model-list {
    height: 400px;
    border: 1px solid red;
  }
}
</style>
