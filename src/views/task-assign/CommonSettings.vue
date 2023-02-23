<template>
  <n-form
    ref="formRef"
    :model="settings"
    :rules="taskAssignFormRules.commonSettingFormRules"
  >
    <n-grid cols="1 300:2 600:4" :x-gap="24">
      <n-form-item-gi span="1" :label="AliasCN['taskName']" path="taskName">
        <n-input
          v-model:value="settings.taskName"
          placeholder="网络异常流量预测"
        />
      </n-form-item-gi>

      <n-form-item-gi span="1" :label="AliasCN['modelName']" path="modelName">
        <n-select v-model:value="settings.modelName" :options="modelOptions" />
      </n-form-item-gi>

      <n-form-item-gi span="1" :label="AliasCN['timeLimit']" path="timeLimit">
        <n-date-picker
          v-model:value="timeLimitForMillisecond"
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
          placeholder="在这里向参与者详细描述一下您的任务"
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { modelOptions } from '@/configs/selectOptions'
import useModelSettingsStore from '@/store/modelSettings'
import { AliasCN } from '@/configs/maps'
import { taskAssignFormRules } from '@/configs/formRules'
import useGlobalStateStore from '@/store/globalState'
import { FormInst } from 'naive-ui'

const formRef = ref<FormInst | null>(null)
const globalStateStore = useGlobalStateStore()
const settings = useModelSettingsStore().commonSettings

const timeLimitForMillisecond = ref(Date.now() + 86400 * 1000)
watchEffect(() => {
  settings.timeLimit = Math.round(
    (timeLimitForMillisecond.value - Date.now()) / 1000
  )
})

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    formRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>
