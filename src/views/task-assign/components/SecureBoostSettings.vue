<template>
  <n-form :model="settings" :rules="rules">
    <n-grid cols="1 300:2 600:4" :x-gap="24">
      <n-form-item-gi label="任务类型" path="taskType">
        <n-select
          v-model:value="settings.taskType"
          placeholder="请选择任务类型"
          :options="taskTypeOptions"
          clearable
        />
      </n-form-item-gi>

      <n-form-item-gi
        v-if="settings.taskType === 'classification'"
        label="分类类型"
        path="evalType"
      >
        <n-select
          v-model:value="settings.evalType"
          placeholder="请选择分类类型"
          :options="evalTypeOptions"
          clearable
        />
      </n-form-item-gi>

      <n-form-item-gi label="树的个数" path="numTrees">
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-input-number
              v-model:value="settings.numTrees"
              :precision="0"
              :min="1"
            />
          </template>

          最大boosting轮数
        </n-tooltip>
      </n-form-item-gi>

      <n-form-item-gi label="最大树深" path="maxDepth">
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-input-number
              v-model:value="settings.maxDepth"
              :precision="0"
              :min="1"
            />
          </template>
          决策树的最大深度
        </n-tooltip>
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modules/modelSettings'

const settings = useModelSettings().secureBoostSettings

const rules = {
  taskType: {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  evalType: {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  numTrees: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
  maxDepth: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

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
