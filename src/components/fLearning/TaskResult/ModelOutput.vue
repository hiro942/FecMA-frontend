<template>
  <div id="model-output">
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
    <div id="chart-canvas"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, computed, defineProps, watchEffect, nextTick } from 'vue'
import useLayoutStore from '@/store/modules/layout'

const props = defineProps<{
  modelInfo: FLearningAPI.ModelInfo
}>()

const layoutStore = useLayoutStore()

const activeTreeIndex = ref(0)
const currentChartData = ref()
const chartDOM = ref() // canvas挂载的DOM节点
const myChart = ref()
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

const option = computed(() => ({
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove',
    formatter: (node: any) => `weight: ${node.value}`, // 元素onFocus显示内容格式化
  },
  series: [
    {
      type: 'tree',
      id: 0,
      data: [currentChartData.value],
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

// 渲染canvas
const renderChart = () => {
  setTimeout(() => {
    myChart.value.setOption(option.value)
  }, 1)
}

// 监听 model-tree-seletor
watchEffect(() => {
  currentChartData.value = arrayToTree(
    props.modelInfo.trees[activeTreeIndex.value].tree,
  )
  if (myChart.value) {
    renderChart()
  }
})

nextTick(() => {
  // dom挂载后初始化canvas
  chartDOM.value = document.getElementById('chart-canvas') as HTMLElement
  console.log(chartDOM.value)

  myChart.value = echarts.init(chartDOM.value)
  renderChart()
})
</script>

<script lang="ts">
export default {
  name: 'ModelOutput',
}
</script>

<style scoped lang="scss">
#model-output {
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

  #chart-canvas {
    width: 100%;
    height: 450px;
    border: 2px solid black;
    canvas {
      width: 100%;
    }
  }
}
</style>
