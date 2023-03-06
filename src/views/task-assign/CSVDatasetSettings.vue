<template>
  <n-alert type='warning' class='my-5'>
    请上传CSV格式文件。文件中，数据ID请置于第一列，若存在数据标签，请置于第二列。
  </n-alert>

  <n-space>
    <UploadDragger
      style='width: 390px'
      filetype='text/csv'
      filename='训练数据'
      :on-file-change='onTrainFileChange'
    />

    <UploadDragger
      style='width: 390px'
      filetype='text/csv'
      filename='测试数据'
      :on-file-change='onEvaluateFileChange'
    />
  </n-space>

  <template v-if='modelSettings.csvDatasetSettings.featureNames.length'>
    <n-form-item
      ref='formItemRef'
      label='标签名称'
      :rule='taskAssignFormRules.labelNameFormItemRule'
      label-placement='left'
      class='mt-[20px]'
    >
      <n-input
        v-model:value='modelSettings.csvDatasetSettings.labelName'
        placeholder='请输入CSV文件中标签列列名'
      />
    </n-form-item>
    <n-data-table
      :columns='tableColumns'
      :data='featureDescriptionList'
      :max-height='250'
    />
  </template>
</template>

<script setup lang='ts'>
import useModelSettingsStore from '@/store/modelSettings'
import { h, ref, watchEffect } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { FormItemInst, NInput, UploadFileInfo, useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/globalState'
import { taskAssignFormRules } from '@/configs/formRules'

const message = useMessage()
const globalStateStore = useGlobalStateStore()
const modelSettings = useModelSettingsStore()

const formItemRef = ref<FormItemInst | null>(null)

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettings.dataset.trainFile = undefined
    modelSettings.csvDatasetSettings.labelName = ''
    modelSettings.csvDatasetSettings.featureNames = []
    return
  }

  modelSettings.dataset.trainFile = fileList[0].file
  const reader = new FileReader()
  // readAsText是个异步操作，只有等到onload时才能显示数据。
  reader.readAsText(fileList[0].file as File)
  const timer = setInterval(() => {
    if (reader.result) {
      modelSettings.csvDatasetSettings.featureNames = (reader.result as string)
        .split('\n')[0]
        .split(',')
        .slice(2)
        .map((item) => ({
          name: item,
          description: ''
        }))
      clearInterval(timer)
    }
  }, 500)
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettings.dataset.evaluateFile = undefined
    return
  }
  modelSettings.dataset.evaluateFile = fileList[0].file
}

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
    width: '20%'
  },
  {
    title: '特征描述',
    key: 'description',
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.description,
        placeholder: '特征描述（非必填）',
        onUpdateValue(v) {
          featureDescriptionList.value[index].description = v
        }
      })
    }
  }
]

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    // 数据集验证
    if (
      !modelSettings.dataset.trainFile ||
      !modelSettings.dataset.evaluateFile
    ) {
      globalStateStore.taskAssignFormValid = false
      message.error('请上传数据集')
    }

    // 表单验证
    formItemRef.value?.validate().catch(() => {
      globalStateStore.taskAssignFormValid = false
    })
  }
})
</script>
