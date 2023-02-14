<template>
  <div :id="chartId" class="w-full h-[500px]"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted } from 'vue'
import { EChartsType } from 'echarts'

type EChartsOption = echarts.EChartsOption

const props = defineProps<{
  chartId: string
  chartName?: string
  xAxisName?: string
  yAxisName?: string
  chartData: number[][]
  adjointData?: {
    name: string
    data: number[]
  }[]
}>()

let chartInstance: EChartsType
let option: EChartsOption

const chartInit = () => {
  chartInstance = echarts.init(
    document.getElementById(props.chartId) as HTMLElement,
    'light'
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
        param.forEach((paramItem: any) => {
          const { dataIndex } = paramItem
          if (dataIndex % param.length === 1) formattedText += '<br/><br/>'
          if (props.xAxisName) {
            formattedText += `${props.xAxisName}: ${props.chartData[dataIndex][0]}`
          }
          if (props.yAxisName) {
            if (props.xAxisName) {
              formattedText += '<br/>'
            }
            formattedText += `${props.yAxisName}: ${props.chartData[dataIndex][1]}`
          }
          if (props.adjointData) {
            props.adjointData.forEach((item) => {
              formattedText += `<br/>${item.name}: ${item.data[dataIndex]}`
            })
          }
        })

        return formattedText
      },
    },
    xAxis: {
      name: props.xAxisName,
      type: 'value',
    },
    yAxis: {
      name: props.yAxisName,
      type: 'value',
    },
    series: [
      {
        data: props.chartData,
        type: 'line',
        smooth: true,
      },
    ],
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
