<template>
  <n-button class='w-full mb-5' type='info' secondary @click='showLayersSettingDrawer=true'>
    网络结构配置
  </n-button>
  <n-drawer v-model:show='showLayersSettingDrawer' resizable default-width='420' :auto-focus='false'>
    <n-drawer-content title='网络结构配置'>
      <LayersSetting />
    </n-drawer-content>
  </n-drawer>

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
        <n-select v-model:value='settings.loss' :options='lossOptions' />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['optimizer']" path='optimizer'>
        <n-select
          v-model:value='settings.optimizer'
          :options='optimizerOptions.nn'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['learningRate']" path='learningRate'>
        <n-input-number
          v-model:value='settings.learningRate'
          :min='1e-9'
          :step='0.001'
        />
      </n-form-item-gi>

      <n-form-item-gi :label="AliasCN['earlyStop']" path='earlyStop'>
        <n-select
          v-model:value='settings.earlyStop'
          :options='earlyStopOptions.nn'
        />
      </n-form-item-gi>

      <n-form-item-gi label='对label进行one-hot编码' path='encodeLabel'>
        <n-select
          v-model:value='settings.encodeLabel'
          :options='switchOptions'
        />
      </n-form-item-gi>

      <n-form-item-gi
        label='每多少Epoch聚合一次模型'
        path='aggregateEveryNEpoch'
      >
        <n-input-number
          v-model:value='settings.aggregateEveryNEpoch'
          :precision='0'
          :step='1'
          :min='1'
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>

  <!--  <code-editor />-->
</template>

<script setup lang='ts'>
import useModelSettingsStore from '@/store/modelSettings'
import { taskAssignFormRules } from '@/configs/formRules'
import { earlyStopOptions, lossOptions, optimizerOptions, switchOptions } from '@/configs/selectOptions'
import { AliasCN } from '@/configs/maps'
import useGlobalStateStore from '@/store/globalState'
import { ref, watchEffect } from 'vue'
import { FormInst } from 'naive-ui'
import LayersSetting from '@/views/task-assign/NeuralNetworkSettings/LayerSettings/Index.vue'

const settings = useModelSettingsStore().neuralNetworkSettings
const globalStateStore = useGlobalStateStore()
const formRef = ref<FormInst | null>(null)


const showLayersSettingDrawer = ref(false)

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    formRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>
