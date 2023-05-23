<template>
  <div :id="chartId" class="w-full h-[500px]"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { EChartsType } from 'echarts'
import { onMounted, onUnmounted } from 'vue'

type EChartsOption = echarts.EChartsOption

const props = defineProps<{
  chartId: string
  chartName?: string
  xAxisName?: string
  yAxisName?: string
  chartData: {
    name: string
    data: number[][]
  }[]
  adjointData?: {
    name: string
    data: number[]
  }[]
}>()

let chartInstance: EChartsType
let option: EChartsOption

const chartInit = () => {
  chartInstance = echarts.init(
    document.getElementById(props.chartId) as HTMLElement
  )
}

const chartRender = () => {
  option = {
    title: {
      text: props.chartName,
    },
    tooltip: {
      trigger: 'axis',
      formatter(param: any) {
        let formattedText = ''
        const { dataIndex } = param[0]
        for (let i = 0; i < param.length; i += 1) {
          formattedText += `${param[i].seriesName}: ${param[i].value || '-'}`
          if (i < param.length - 1) {
            formattedText += '<br/>'
          }
        }
        if (props.adjointData) {
          props.adjointData.forEach((item) => {
            formattedText += `<br/>${item.name}: ${item.data[dataIndex] || '-'}`
          })
        }
        return formattedText
      },
    },
    legend: {
      data: props.chartData.map((item) => item.name),
    },
    xAxis: {
      name: props.xAxisName,
      type: 'category',
      data: props.chartData[0].data.map((pair) => pair[0]),
    },
    yAxis: {
      name: props.yAxisName,
      type: 'value',
    },
    series: props.chartData.map((item) => ({
      name: item.name,
      data: item.data.map((pair) => pair[1]),
      type: 'line',
      smooth: true,
    })),
  }
  chartInstance.setOption(option)
}

onMounted(() => {
  chartInit()
  chartRender()
})

onUnmounted(() => {
  echarts.dispose(chartInstance)
})
</script>