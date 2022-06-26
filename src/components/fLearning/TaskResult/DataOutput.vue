<template>
  <div id="data-output">
    <el-table
      :data="dataOutput"
      border
      style="width: 100%"
      :header-cell-style="{
        height: '60px',
        border: '1px solid #fff',
        color: '#6A6C75',
        backgroundColor: '#DEECFC',
      }"
      :cell-style="cellSytle"
    >
      <el-table-column
        v-for="label in tableColumns"
        :key="label"
        :label="label"
        :prop="label"
        align="center"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="layoutStore.taskResultDialogVisible = false"
          >
            关闭
          </el-button>
        </span>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import useLayoutStore from '@/store/modules/layout'

const layoutStore = useLayoutStore()

const tableColumns = [
  'index',
  'id',
  'label',
  'predict_result',
  'predict_score',
  'predict_detail',
  'type',
]

// 单元格样式
const cellSytle = (cell: any) => {
  if (cell.column.label === 'index') {
    return { border: '1px solid #fff', backgroundColor: '#EBEDF0' }
  }
  return { border: '1px solid #fff', backgroundColor: '#FAFBFC' }
}

// TODO: data output 假数据
const dataOutput = [
  {
    index: 1,
    id: 8,
    label: 0,
    predict_result: 0,
    predict_score: 0.23333,
    predict_detail: '{xxxx}',
    type: 'train',
  },
  {
    index: 2,
    id: 8,
    label: 0,
    predict_result: 0,
    predict_score: 0.23333,
    predict_detail: '{xxxx}',
    type: 'train',
  },
]
</script>

<script lang="ts">
export default {
  name: 'DataOutput',
}
</script>
