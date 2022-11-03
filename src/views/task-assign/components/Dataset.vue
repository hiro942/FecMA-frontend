<template>
  <n-space>
    <UploadDragger
      style="width: 390px"
      filename="训练数据"
      :on-file-change="onTrainFileChange"
    />

    <UploadDragger
      style="width: 390px"
      filename="测试数据"
      :on-file-change="onEvaluateFileChange"
    />
  </n-space>
</template>

<script setup lang="ts">
import UploadDragger from '@/components/upload/UploadDragger.vue'
import useModelSettings from '@/store/modules/modelSettings'
import { UploadFileInfo } from 'naive-ui'

const modelSettings = useModelSettings()

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  const selectedFile = fileList[0].file
  modelSettings.dataset.trainFile = selectedFile
  if (!selectedFile) {
    modelSettings.csvDatasetSettings.featureNames = []
    return
  }

  const reader = new FileReader()
  // readAsText是个异步操作，只有等到onload时才能显示数据。
  reader.readAsText(selectedFile)
  const timer = setInterval(() => {
    if (reader.result) {
      modelSettings.csvDatasetSettings.featureNames = (reader.result as string)
        .split('\n')[0]
        .split(',')
        .slice(2)
        .map((item) => ({
          name: item,
          description: '',
        }))
      clearInterval(timer)
    }
  }, 500)
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  modelSettings.dataset.evaluateFile = fileList[0].file
}
</script>

<style scoped></style>
