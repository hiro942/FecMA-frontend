<template>
  <n-space>
    <UploadDragger
      style="width: 390px"
      filename="训练数据"
      tip="提示：文件只支持 CSV 格式, 数据id置于第一列，标签置于第二列(若存在)"
      :on-file-change="onTrainFileChange"
    />

    <UploadDragger
      style="width: 390px"
      filename="测试数据"
      tip="提示：文件只支持 CSV 格式, 数据id置于第一列，标签置于第二列(若存在)"
      :on-file-change="onEvaluateFileChange"
    />
  </n-space>

  <template v-if="modelSettings.datasetInfo.featureNames.length">
    <n-form-item
      label="标签名称"
      required
      label-placement="left"
      style="margin-top: 20px"
    >
      <n-input
        v-model:value="modelSettings.datasetInfo.labelName"
        placeholder="请输入"
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
import UploadDragger from '@/components/upload/UploadDragger.vue'
import useModelSettings from '@/store/modules/modelSettings'
import { h, ref, watchEffect } from 'vue'
import { NInput, UploadFileInfo } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const modelSettings = useModelSettings()

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  const selectedFile = fileList[0]?.file
  modelSettings.datasetInfo.trainFile = selectedFile
  if (!selectedFile) {
    modelSettings.datasetInfo.featureNames = []
    console.log(
      'feature names 已清除：',
      modelSettings.datasetInfo.featureNames
    )
    return
  }
  console.log('train file已记录：', modelSettings.datasetInfo.trainFile)

  const reader = new FileReader()
  // readAsText是个异步操作，只有等到onload时才能显示数据。
  reader.readAsText(selectedFile)
  const timer = setInterval(() => {
    if (reader.result) {
      modelSettings.datasetInfo.featureNames = (reader.result as string)
        .split('\n')[0]
        .split(',')
        .slice(2)
        .map((item) => ({
          name: item,
          description: '',
        }))
      console.log(
        'feature names 已记录：',
        modelSettings.datasetInfo.featureNames
      )
      console.log(JSON.stringify(modelSettings.datasetInfo.featureNames))
      clearInterval(timer)
    }
  }, 500)
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  const selectedFile = fileList[0]?.file
  modelSettings.datasetInfo.evaluateFile = selectedFile
  if (!selectedFile) {
    console.log('evaluate file已清除：', modelSettings.datasetInfo.evaluateFile)
  } else {
    console.log('evaluate file已记录：', modelSettings.datasetInfo.evaluateFile)
  }
}

type FeatureDescription = {
  name: string
  description: string
}

const featureDescriptionList = ref<FeatureDescription[]>([])
watchEffect(() => {
  featureDescriptionList.value = modelSettings.datasetInfo.featureNames
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
        placeholder: '请输入',
        onUpdateValue(v) {
          featureDescriptionList.value[index].description = v
        },
      })
    },
  },
]
</script>
