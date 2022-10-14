<template>
  <div id="data-output">
    <el-table
      :data="dataOutput"
      border
      style="width: 100%"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <el-table-column
        v-for="label in tableColumns"
        :key="label"
        :label="label"
        :prop="label"
        align="center"
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { tableHeaderCellStyle, tableCellStyle } from '@/utils/style'

const tableColumns = [
  'index',
  'id',
  'label',
  'predict_result',
  'predict_score',
  'predict_detail',
  'type',
]

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
