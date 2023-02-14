<template>
  <n-form
    :model="featureEngineeringSettings"
    :rules="taskAssignFormRules.featureEngineeringSettingFormRules"
  >
    <n-space justify="space-between" align="center">
      <h4>特征分箱</h4>
      <n-checkbox
        v-model:checked="featureEngineeringChecked.HomoFeatureBinning"
      >
        启用
      </n-checkbox>
    </n-space>
    <n-grid
      v-if="featureEngineeringChecked.HomoFeatureBinning"
      cols="1"
      :x-gap="24"
    >
      <n-form-item-gi label="分箱特征选择" path="HomoFeatureBinning.binNames">
        <n-transfer
          ref="transfer"
          v-model:value="featureEngineeringSettings.HomoFeatureBinning.binNames"
          :options="featureList"
        />
      </n-form-item-gi>
    </n-grid>

    <n-space justify="space-between" align="center">
      <h4>特征归一化</h4>
      <n-checkbox v-model:checked="featureEngineeringChecked.FeatureScale">
        启用
      </n-checkbox>
    </n-space>
    <n-grid v-if="featureEngineeringChecked.FeatureScale" cols="1" :x-gap="24">
      <n-form-item-gi label="归一化方式" path="FeatureScale.method">
        <n-select
          v-model:value="featureEngineeringSettings.FeatureScale.method"
          :options="featureScaleMethodOptions"
          clearable
        />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useModelSettings from '@/store/modelSettings'
import { featureScaleMethodOptions } from '@/configs/selectOptions'
import { taskAssignFormRules } from '@/configs/formRules'

const {
  csvDatasetSettings,
  featureEngineeringSettings,
  featureEngineeringChecked,
} = useModelSettings()

const featureList = ref(
  csvDatasetSettings.featureNames.map((item) => ({
    label: item.name,
    value: item.name,
  }))
)
</script>
