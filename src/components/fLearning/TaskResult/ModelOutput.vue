<template>
  <div id="model-output">
    <div class="model-structure-container">
      <h3>Tree</h3>
      <div class="model-tree-selector">
        <div
          v-for="treeSeq in props.modelInfo.treeNum"
          :key="treeSeq"
          class="model-tree-selector-item"
          :class="treeSeq - 1 === activeTreeIndex ? 'active-selector-item' : ''"
          @click="activeTreeIndex = treeSeq - 1"
        />
      </div>
      <h4 class="chart-header">
        <span>Tree ID: {{ activeTreeIndex }}</span>
        <span style="margin-left: 30px">
          Tree Size: {{ props.modelInfo.trees[activeTreeIndex].tree.length }}
        </span>
      </h4>
      <div id="model-structure-chart"></div>
    </div>

    <el-divider />

    <div class="model-performance-container">
      <h3>Performance</h3>
      <div id="model-performance-chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, computed, defineProps, watch, nextTick, watchEffect } from 'vue'
import useLayoutStore from '@/store/modules/layout'

const props = defineProps<{
  modelInfo: FLearningAPI.ModelInfo
}>()

const layoutStore = useLayoutStore()

const activeTreeIndex = ref(0)
const currentModelStructureData = ref()
const modelStructureChartDOM = ref() // 模型结构chart挂载的DOM节点
const modelPerformanceChartDOM = ref() // 模型性能chart挂载的DOM节点
const modelStructureChart = ref() // 模型结构chart实例
const modelPerformanceChart = ref() // 模型性能chart实例
const accNum = 3 // 显示数据保留几位小数

const nameFormatter = (
  id: number,
  bid: number,
  fid: number,
  weight: number,
  isLeaf: boolean,
) => {
  if (isLeaf) {
    return `ID: ${id} \n weight: ${weight.toFixed(accNum)}`
  }
  return `ID: ${id} \n x${fid} <= ${bid.toFixed(accNum)}`
}

// 得到以当前节点为root的子树列表
const getSubTrees = (arr: any, currentNodeid: number) => {
  const subTrees = []
  const { leftNodeid, rightNodeid } = arr[currentNodeid]
  if (leftNodeid !== -1) {
    const leftNode = arr[leftNodeid]
    leftNode.children = getSubTrees(arr, leftNodeid)
    const { id, bid, fid, weight, isLeaf } = leftNode
    subTrees.push({
      name: nameFormatter(id, bid, fid, weight, isLeaf),
      value: weight,
      children: leftNode.children,
    })
  }
  if (rightNodeid !== -1) {
    const rightNode = arr[rightNodeid]
    rightNode.children = getSubTrees(arr, rightNodeid)
    const { id, bid, fid, weight, isLeaf } = rightNode
    subTrees.push({
      name: nameFormatter(id, bid, fid, weight, isLeaf),
      value: weight,
      children: rightNode.children,
    })
  }
  return subTrees
}

// 树的扁平数组表示转嵌套对象表示
const arrayToTree = (arr: any) => {
  const rootNodeid = 0
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].id === rootNodeid) {
      const { id, bid, fid, weight, isLeaf } = arr[rootNodeid]
      return {
        name: nameFormatter(id, bid, fid, weight, isLeaf),
        value: weight,
        children: getSubTrees(arr, rootNodeid),
      }
    }
  }
  return {}
}

const modelStructureChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    formatter: (node: any) => `weight: ${node.value}`, // 元素onFocus显示内容格式化
  },
  series: [
    {
      type: 'tree',
      id: 0,
      data: [currentModelStructureData.value],
      orient: 'TB',
      bottom: '20%',
      symbolSize: 7,
      symbol: 'circle',
      roam: true, // 开启鼠标缩放
      lineStyle: {
        width: 2,
      },
      label: {
        fontSize: 14,
        lineHeight: 15,
        padding: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#000',
        color: '#fff',
        backgroundColor: layoutStore.activeColor,
        align: 'center',
        overflow: 'breakAll',
      },
      leaves: {
        label: {
          position: 'bottom',
          // verticalAlign: 'middle',
        },
      },
      animationDuration: 550,
      animationDurationUpdate: 750,
    },
  ],
}))

const modelPerformanceChartOption = {
  title: {
    text: 'Stacked Line',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
}

// 渲染model-structure
const renderModelStructureChart = () => {
  setTimeout(() => {
    modelStructureChart.value.setOption(modelStructureChartOption.value)
  }, 1)
}
const renderModelPerformanceChart = () => {
  setTimeout(() => {
    modelPerformanceChart.value.setOption(modelPerformanceChartOption)
  }, 1)
}

// 监听 activeTreeIndex
watch(
  () => activeTreeIndex.value,
  () => {
    currentModelStructureData.value = arrayToTree(
      props.modelInfo.trees[activeTreeIndex.value].tree,
    )
    renderModelStructureChart()
  },
  { immediate: true }, // 页面刷新后立即执行以获得初始数据，避免data为空
)

nextTick(() => {
  // dom挂载后初始化canvas chart
  modelStructureChartDOM.value = document.getElementById(
    'model-structure-chart',
  )
  modelStructureChart.value = echarts.init(modelStructureChartDOM.value)
  renderModelStructureChart()

  modelPerformanceChartDOM.value = document.getElementById(
    'model-performance-chart',
  )
  modelPerformanceChart.value = echarts.init(modelPerformanceChartDOM.value)
  renderModelPerformanceChart()
})
</script>

<script lang="ts">
export default {
  name: 'ModelOutput',
}
</script>

<style scoped lang="scss">
#model-output {
  .model-structure-container {
    .model-tree-selector {
      width: 100%;
      height: 100px;
      display: flex;
      background-color: #eee;

      .model-tree-selector-item {
        width: 50px;
        margin-right: 1px;
        text-align: center;
        cursor: pointer;
        border-radius: 2px;
        background-color: var(--sys-blue);
        &:hover {
          background-color: rgb(96, 122, 238);
        }

        &.active-selector-item {
          background-color: pink;
        }
      }
    }
    .chart-header {
      color: #666;
    }

    #model-structure-chart {
      width: 100%;
      height: 450px;
      border: 2px solid black;
      canvas {
        width: 100%;
      }
    }
  }

  .model-performance-container {
    #model-performance-chart {
      width: 100%;
      height: 450px;
      border: 2px solid black;
      canvas {
        width: 100%;
      }
    }
  }
}
</style>
