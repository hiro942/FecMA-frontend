<template>
  <div :id="chartId" class="chart-box"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, onUnmounted } from 'vue'
import { EChartsType } from 'echarts'

type EChartsOption = echarts.EChartsOption

const props = defineProps<{
  chartId: string
  gaugeData: {
    name: string
    value: number
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

const getGaugeData = () => {
  let n = -7
  return props.gaugeData.map((item) => {
    n += 5
    return {
      value: Math.ceil(item.value),
      name: item.name,
      title: {
        offsetCenter: ['0%', `${n * 10}%`],
      },
      detail: {
        valueAnimation: true,
        offsetCenter: ['0%', `${n * 10 + 20}%`],
      },
    }
  })
}

const chartRender = () => {
  option = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: '#464646',
          },
        },
        axisLine: {
          lineStyle: {
            width: 30,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: getGaugeData(),
        title: {
          fontSize: 13,
        },
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          formatter: '{value}%',
        },
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

<style scoped>
.chart-box {
  height: 300px;
  width: 100%;
}
</style>
