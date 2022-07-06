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
            <span @click="viewTasks(state.name)">View Detail</span>
            <el-icon><DArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="blockchain-info">区块链信息</div>

      <div id="latest-task-state-chart"></div>

      <div class="recommend-list">
        Recommend
        <el-button @click="changeTaskBatch">换一批</el-button>
        <el-input v-model="searchContent" placeholder="Please input">
          <template #append>
            <el-button :icon="Search" @click="searchTask" />
          </template>
        </el-input>
      </div>
    </div>

    <div class="model-list">已有模型</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
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

const globalStateStore = useGlobalStateStore()

const cardsStyle = [
  { color: 'rgb(165, 219, 203)', icon: Monitor },
  { color: 'rgb(243, 225, 171)', icon: ElementPlus },
  { color: 'rgb(166, 219, 243)', icon: AlarmClock },
  { color: 'rgb(235, 188, 188)', icon: DataAnalysis },
]

const taskState = [
  { name: 'ALL', number: 23 },
  { name: 'ASSIGNED', number: 16 },
  { name: 'TRAINED', number: 5 },
  { name: 'FINISHED', number: 2 },
]

const searchContent = ref('')

// 在所有任务内随机选择若干项
const changeTaskBatch = () => {}

// 查看特定状态的任务
const viewTasks = (stateName: string) => {
  if (stateName !== 'ALL') {
    globalStateStore.filterTaskState = stateName
  }
  router.push('/federate-learning/my-task')
}

// 搜索任务
const searchTask = () => {
  globalStateStore.searchTaskName = searchContent.value
  router.push('/federate-learning/all-task')
}

const taskStateChartDOM = ref()
const taskStateChart = ref()

const option = computed(() => ({
  xAxis: {
    name: '任务名',
    type: 'category',
    data: ['任务1', '任务2', '任务3'],
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
      data: ['进行中', '待开始', '已完成'],
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
  taskStateChartDOM.value = document.getElementById('latest-task-state-chart')
  taskStateChart.value = echarts.init(taskStateChartDOM.value)
  taskStateChart.value.setOption(option.value)
})
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
      border: 1px solid yellowgreen;
    }
  }

  .model-list {
    height: 400px;
    border: 1px solid red;
  }
}
</style>
