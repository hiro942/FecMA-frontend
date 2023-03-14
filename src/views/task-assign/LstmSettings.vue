<template>
  <n-form
    ref='formRef'
    :model='settings'
    :rules='taskAssignFormRules.neuralNetworkSettingFormRules'
  >
    <n-grid cols='1 300:2 600:4' :x-gap='24'>
      <n-form-item-gi :label="AliasCN['maxIter']" path='maxIter'>
        <n-input-number
          v-model:value='settings.maxIter'
          :precision='0'
          :step='500'
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

      <n-form-item-gi :label="AliasCN['loss']" path='loss'>
        <n-select v-model:value='settings.loss' :options='lossOptions' :render-option='optionsWithTooltip' />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['learningRate']" path='learningRate'>
        <n-input-number
          v-model:value='settings.learningRate'
          :min='1e-9'
          p
          :step='0.001'
        />
      </n-form-item-gi>

      <n-form-item-gi label='对label进行one-hot编码' path='encodeLabel'>
        <n-select
          v-model:value='settings.encodeLabel'
          :options='switchOptions'
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>

  <!--  <code-editor />-->
</template>

<script setup lang='ts'>
import useModelSettingsStore from '@/store/modelSettings'
import { taskAssignFormRules } from '@/configs/formRules'
import { lossOptions, optionsWithTooltip, switchOptions } from '@/configs/selectOptions'
import { AliasCN } from '@/configs/maps'
import useGlobalStateStore from '@/store/globalState'
import { ref, watchEffect } from 'vue'
import { FormInst, NTooltip } from 'naive-ui'

const settings = useModelSettingsStore().lstmSettings
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
