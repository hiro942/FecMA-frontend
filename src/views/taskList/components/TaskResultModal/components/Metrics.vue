<template>
  <div class="model-performance-container">
    <h3>Performance</h3>
    <div id="model-performance-chart" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import * as echarts from 'echarts'

const modelPerformanceChartDOM = ref() // 模型性能chart挂载的DOM节点
const modelPerformanceChart = ref() // 模型性能chart实例

const modelPerformanceChartOption = {
  title: {
    text: 'Stacked Line',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Loss', 'Acc'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['100', '200', '300', '400', '500', '600', '700'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Loss',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Acc',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
  ],
}

const renderModelPerformanceChart = () => {
  setTimeout(() => {
    modelPerformanceChart.value.setOption(modelPerformanceChartOption)
  }, 1)
}

nextTick(() => {
  // dom挂载后初始化canvas chart
  modelPerformanceChartDOM.value = document.getElementById(
    'model-performance-chart'
  )
  modelPerformanceChart.value = echarts.init(modelPerformanceChartDOM.value)
  renderModelPerformanceChart()
})
</script>

<style scoped></style>
