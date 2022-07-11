<template>
  <div id="chart"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, computed, onMounted, nextTick } from 'vue'
import { AliasCN } from '@/constants'
import { fetchMyTask } from '@/api/fLearning'

const myTasks = await fetchMyTask() // [api] 获取我的任务

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

nextTick(() => {
  // [Chart] 初始化 chart
  taskProgressChartDOM.value = document.getElementById('chart')
  console.log(taskProgressChartDOM.value)

  taskProgressChart.value = echarts.init(taskProgressChartDOM.value)
  taskProgressChart.value.setOption(option.value)
})
</script>

<script lang="ts">
export default {
  name: 'Chart',
}
</script>

<style scoped lang="scss"></style>
