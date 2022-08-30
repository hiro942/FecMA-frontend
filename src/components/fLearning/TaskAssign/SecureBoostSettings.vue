<template>
  <div style="display: flex; column-gap: 30px; flex-wrap: wrap">
    <el-form-item label="任务类型" prop="taskType">
      <el-select v-model="settings.taskType" placeholder="请选择任务类型">
        <el-option
          v-for="item in taskTypeOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item
      v-if="settings.taskType === 'classification'"
      label="分类类型"
      prop="evalType"
    >
      <el-select v-model="settings.evalType" placeholder="请选择任务类型">
        <el-option
          v-for="item in evalTypeOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="树的个数" prop="numTrees">
      <el-tooltip content="最大boosting轮数，默认为5" placement="bottom">
        <el-input-number v-model="settings.numTrees" :precision="0" :min="1" />
      </el-tooltip>
    </el-form-item>

    <el-form-item label="最大树深" prop="maxDepth">
      <el-tooltip content="决策树的最大深度，默认为3" placement="bottom">
        <el-input-number v-model="settings.maxDepth" :precision="0" :min="1" />
      </el-tooltip>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modules/modelSettings'

const settings = useModelSettings().secureBoostSettings

const taskTypeOptions = [
  { value: 'classification', label: '分类任务' },
  { value: 'regression', label: '回归任务' },
]

const evalTypeOptions = [
  { value: 'binary', label: '二分类' },
  { value: 'multi', label: '多分类' },
]
</script>

<style scoped></style>
