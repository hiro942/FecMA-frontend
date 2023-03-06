<template>
  <n-form
    ref='formRef'
    :model='settings'
    :rules='taskAssignFormRules.logisticSettingFormRules'
  >
    <n-grid cols='1 300:2 600:4' :x-gap='24'>
      <n-form-item-gi :label="AliasCN['maxIter']" path='maxIter'>
        <n-input-number
          v-model:value='settings.maxIter'
          :precision='0'
          :step='100'
          :min='1'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['batchSize']" path='batchSize'>
        <n-tooltip trigger='hover' placement='bottom'>
          <template #trigger>
            <n-input-number
              v-model:value='settings.batchSize'
              :precision='0'
              :min='-1'
            />
          </template>
          -1 代表 full-batch
        </n-tooltip>
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['optimizer']" path='optimizer'>
        <n-select
          v-model:value='settings.optimizer'
          :options='optimizerOptions.lr'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['learningRate']" path='learningRate'>
        <n-input-number
          v-model:value='settings.learningRate'
          :min='1e-9'
          :step='0.001'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['penalty']" path='penalty'>
        <n-select
          v-model:value='settings.penalty'
          :options='penaltyOptions.lr'
        />
      </n-form-item-gi>

      <n-form-item-gi label='正则化系数' path='alpha'>
        <n-input-number
          v-model:value='settings.alpha'
          :min='0.1'
          :precision='1'
          :step='0.1'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['earlyStop']" path='earlyStop'>
        <n-select
          v-model:value='settings.earlyStop'
          :options='earlyStopOptions.lr'
        />
      </n-form-item-gi>

      <n-form-item-gi label='学习率衰减系数' path='decay'>
        <n-tooltip trigger='hover' placement='bottom'>
          <template #trigger>
            <n-input-number
              v-model:value='settings.decay'
              :precision='1'
              :step='0.1'
              :min='0.1'
            />
          </template>
          lr = lr0 / (1 + decay * t)，t 为迭代次数
        </n-tooltip>
      </n-form-item-gi>

      <n-form-item-gi label='聚合频率' path='aggregateIters'>
        <n-tooltip trigger='hover' placement='bottom'>
          <template #trigger>
            <n-input-number
              v-model:value='settings.aggregateIters'
              :precision='0'
              :step='1'
              :min='1'
            />
          </template>
          每多少次Iteration聚合一次模型
        </n-tooltip>
      </n-form-item-gi>

      <n-form-item-gi label='添加近端项' path='useProximal'>
        <n-select
          v-model:value='settings.useProximal'
          :options='switchOptions'
        />
      </n-form-item-gi>

      <n-form-item-gi
        v-if='settings.useProximal'
        label='近端项缩放系数'
        path='mu'
      >
        <n-input-number
          v-model:value='settings.mu'
          :precision='1'
          :step='0.1'
          :min='0.1'
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang='ts'>
import useModelSettingsStore from '@/store/modelSettings'
import { earlyStopOptions, optimizerOptions, penaltyOptions, switchOptions } from '@/configs/selectOptions'
import { AliasCN } from '@/configs/maps'
import { taskAssignFormRules } from '@/configs/formRules'
import useGlobalStateStore from '@/store/globalState'
import { ref, watchEffect } from 'vue'
import { FormInst } from 'naive-ui'

const settings = useModelSettingsStore().logisticRegressionSettings
const globalStateStore = useGlobalStateStore()
const formRef = ref<FormInst | null>(null)

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    formRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>
