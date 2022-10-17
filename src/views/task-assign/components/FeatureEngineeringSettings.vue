<template>
  <!--  上传数据后再显示特征工程相关配置-->
  <n-form :model="featureEngineeringSettings" :rules="rules">
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
      <!--      <n-form-item-gi-->
      <!--        label="分箱方式"-->
      <!--        path="HomoFeatureBinning.method"-->
      <!--        label-placement="left"-->
      <!--      >-->
      <!--        <n-select-->
      <!--          v-model:value="featureEngineeringSettings.HomoFeatureBinning.method"-->
      <!--          :options="featureBinningMethodOptions"-->
      <!--          clearable-->
      <!--        />-->
      <!--      </n-form-item-gi>-->

      <n-form-item-gi label="分箱特征选择" path="HomoFeatureBinning.binNames">
        <n-config-provider :locale="zhCN" style="width: 100%">
          <n-transfer
            ref="transfer"
            v-model:value="
              featureEngineeringSettings.HomoFeatureBinning.binNames
            "
            :options="featureList"
          />
        </n-config-provider>
      </n-form-item-gi>
    </n-grid>

    <n-space justify="space-between" align="center">
      <h4>特征缩放</h4>
      <n-checkbox v-model:checked="featureEngineeringChecked.FeatureScale">
        启用
      </n-checkbox>
    </n-space>
    <n-grid v-if="featureEngineeringChecked.FeatureScale" cols="1" :x-gap="24">
      <n-form-item-gi label="Scale 方式" path="FeatureScale.method">
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
import { ref, watchEffect } from 'vue'
import {
  featureBinningMethodOptions,
  featureScaleMethodOptions,
} from '@/constants/feature_engineering'
import { zhCN } from 'naive-ui'
import useModelSettings from '@/store/modules/modelSettings'

const { datasetInfo, featureEngineeringSettings, featureEngineeringChecked } =
  useModelSettings()

const rules = {
  HomoFeatureBinning: {
    method: {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
    binNames: {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  },
  FeatureScale: {
    method: {
      required: true,
      message: '请输入',
      trigger: 'blur',
    },
  },
}

const featureList = ref(
  datasetInfo.featureNames.map((item) => ({
    label: item.name,
    value: item.name,
  }))
)
</script>
