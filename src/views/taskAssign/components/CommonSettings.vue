<template>
  <n-form ref="formRef" :model="settings" :rules="rules">
    <n-grid cols="1 300:2 600:4" :x-gap="24">
      <n-form-item-gi span="1" :label="AliasCN['taskName']" path="taskName">
        <n-input
          v-model:value="settings.taskName"
          placeholder="北京海淀区房价预测"
        />
      </n-form-item-gi>

      <n-form-item-gi span="1" :label="AliasCN['modelName']" path="modelName">
        <n-select
          v-model:value="settings.modelName"
          :options="modelOptions"
          placeholder="请选择"
          clearable
        />
      </n-form-item-gi>

      <n-form-item-gi span="1" :label="AliasCN['timeLimit']" path="timeLimit">
        <n-date-picker
          v-model:value="settings.timeLimit"
          type="datetime"
          placeholder="到期后不再接收新参与方"
        />
      </n-form-item-gi>

      <n-form-item-gi span="1" :label="AliasCN['minPeers']" path="minPeers">
        <n-input-number
          v-model:value="settings.minPeers"
          style="max-width: 300px"
          :precision="0"
          :min="1"
        />
      </n-form-item-gi>

      <n-form-item-gi
        span="999"
        :label="AliasCN['description']"
        path="description"
      >
        <n-input
          v-model:value="settings.description"
          type="textarea"
          placeholder="详细描述一下您的任务吧"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { AliasCN } from '@/constants/alias'
import { modelOptions } from '@/constants/algorithm'
import useModelSettings from '@/store/modules/modelSettings'

const rules = {
  taskName: {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  modelName: {
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  timeLimit: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: 'blur',
  },
  minPeers: {
    type: 'number',
    required: true,
    message: '请输入',
    trigger: ['input', 'blur'],
  },
}

const formRef = useModelSettings().commonSettingsFormRef
const settings = useModelSettings().commonSettings
</script>
