<template>
  <n-alert type="warning" style="margin: 20px 0">
    请上传CSV格式文件。文件中，数据ID请置于第一列，若存在数据标签，请置于第二列。
  </n-alert>

  <Dataset />

  <template v-if="modelSettings.csvDatasetSettings.featureNames.length">
    <n-form-item
      label="标签名称"
      required
      label-placement="left"
      style="margin-top: 20px"
    >
      <n-input
        v-model:value="modelSettings.csvDatasetSettings.labelName"
        placeholder="请输入CSV文件中标签列列名"
      />
    </n-form-item>
    <n-data-table
      :columns="tableColumns"
      :data="featureDescriptionList"
      :max-height="250"
    />
  </template>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modelSettings'
import { h, ref, watchEffect } from 'vue'
import { NInput } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import Dataset from '@/views/task-assign/Dataset.vue'

const modelSettings = useModelSettings()

type FeatureDescription = {
  name: string
  description: string
}

const featureDescriptionList = ref<FeatureDescription[]>([])
watchEffect(() => {
  featureDescriptionList.value = modelSettings.csvDatasetSettings.featureNames
})

const tableColumns: DataTableColumns<FeatureDescription> = [
  {
    title: '特征名称',
    key: 'name',
    align: 'center',
    width: '20%',
  },
  {
    title: '特征描述',
    key: 'description',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.description,
        placeholder: '填入该特征的描述（可选择省略）',
        onUpdateValue(v) {
          featureDescriptionList.value[index].description = v
        },
      })
    },
  },
]
</script>
