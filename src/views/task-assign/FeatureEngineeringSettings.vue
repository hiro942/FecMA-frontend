<template>
  <n-form
    ref="formRef"
    :model="featureEngineeringSettings"
    :rules="taskAssignFormRules.featureEngineeringSettingFormRules"
  >
    <n-space justify="space-between" align="center">
      <n-h4>特征分箱</n-h4>
      <n-checkbox
        v-model:checked="featureEngineeringChecked.HomoFeatureBinning"
      >
        启用
      </n-checkbox>
    </n-space>

    <n-form-item
      v-if="featureEngineeringChecked.HomoFeatureBinning"
      label="分箱特征选择"
      path="HomoFeatureBinning.binNames"
      label-placement="top"
    >
      <n-transfer
        ref="transfer"
        v-model:value="featureEngineeringSettings.HomoFeatureBinning.binNames"
        :options="featureList"
      />
    </n-form-item>

    <n-space justify="space-between" align="center">
      <n-h4>特征归一化</n-h4>
      <n-checkbox v-model:checked="featureEngineeringChecked.FeatureScale">
        启用
      </n-checkbox>
    </n-space>

    <n-form-item
      v-if="featureEngineeringChecked.FeatureScale"
      label="归一化方式"
      path="FeatureScale.method"
      label-placement="left"
    >
      <n-select
        v-model:value="featureEngineeringSettings.FeatureScale.method"
        :options="featureScaleMethodOptions"
      />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import useModelSettingsStore from '@/store/modelSettings'
import { featureScaleMethodOptions } from '@/configs/selectOptions'
import { taskAssignFormRules } from '@/configs/formRules'
import { FormInst } from 'naive-ui'
import useGlobalStateStore from '@/store/globalState'

const globalStateStore = useGlobalStateStore()
const formRef = ref<FormInst | null>(null)

const {
  csvDatasetSettings,
  featureEngineeringSettings,
  featureEngineeringChecked,
} = useModelSettingsStore()

const featureList = ref(
  csvDatasetSettings.featureNames.map((item) => ({
    label: item.name,
    value: item.name,
  }))
)

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    formRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>
