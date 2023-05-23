<template>
  <n-form
    ref="formRef"
    :model="settings"
    :rules="taskAssignFormRules.secureBoostSettingFormRules"
  >
    <n-grid cols="1 300:2 600:4" :x-gap="24">
      <n-form-item-gi :label="AliasCN['evalType']" path="evalType">
        <n-select
          v-model:value="settings.evalType"
          placeholder="请选择任务类型"
          :options="evalTypeOptions('homo_secureboost')"
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
import useModelSettingsStore from '@/store/modelSettings'
import { taskAssignFormRules } from '@/configs/formRules'
import useGlobalStateStore from '@/store/globalState'
import { ref, watchEffect } from 'vue'
import { FormInst } from 'naive-ui'
import { AliasCN } from '@/configs/maps'
import { evalTypeOptions } from '@/configs/selectOptions'

const settings = useModelSettingsStore().secureBoostSettings
const globalStateStore = useGlobalStateStore()
const formRef = ref<FormInst | null>(null)

const taskTypeOptions = [
  { value: 'classification', label: '分类任务' },
  { value: 'regression', label: '回归任务' },
]

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    formRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>