<template>
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
    <el-input v-model="settings.numTrees" />
  </el-form-item>

  <el-form-item label="最大树深" prop="maxDepth">
    <el-input v-model="settings.maxDepth" />
  </el-form-item>
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

<script lang="ts">
export default {
  name: 'SecureBoostSetting',
}
</script>

<style scoped></style>
