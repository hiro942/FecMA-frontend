<template>
  <n-alert type="warning" class="my-5">
    请以ZIP文件压缩包的形式上传。除图片外，压缩文件内还应包含一个以
    <strong>[图片名称,标签名]</strong> 形式记录图片标签的CSV文件。
  </n-alert>

  <n-space>
    <UploadDragger
      style="width: 390px"
      filetype="application/zip"
      filename="训练数据"
      :on-file-change="onTrainFileChange"
    />

    <UploadDragger
      style="width: 390px"
      filetype="application/zip"
      filename="测试数据"
      :on-file-change="onEvaluateFileChange"
    />
  </n-space>

  <n-form-item
    label="图像裁剪大小"
    required
    label-placement="left"
    style="margin-top: 20px"
  >
    <n-input-number
      v-model:value="modelSettings.imageDatasetSettings.processSize.width"
      :show-button="false"
      :min="1"
      style="width: 100px"
    >
      <template #suffix> px </template>
    </n-input-number>
    <span>&nbsp; ✖ &nbsp;️</span>
    <n-input-number
      v-model:value="modelSettings.imageDatasetSettings.processSize.height"
      :show-button="false"
      :min="1"
      style="width: 100px"
    >
      <template #suffix> px </template>
    </n-input-number>
  </n-form-item>

  <n-form-item
    label="图像裁剪方式"
    required
    label-placement="left"
    style="margin-top: 20px"
  >
    <n-select
      v-model:value="modelSettings.imageDatasetSettings.interpolation"
      :options="interpolationOptions"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import { interpolationOptions } from '@/configs/selectOptions'
import UploadDragger from '@/components/upload/UploadDragger.vue'
import useModelSettingsStore from '@/store/modelSettings'
import { FormItemInst, UploadFileInfo, useMessage } from 'naive-ui'
import { ref, watchEffect } from 'vue'
import useGlobalStateStore from '@/store/globalState'

const globalStateStore = useGlobalStateStore()
const message = useMessage()
const modelSettings = useModelSettingsStore()

const formItemRef = ref<FormItemInst | null>(null)

const onTrainFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettings.dataset.trainFile = undefined
    return
  }
  modelSettings.dataset.trainFile = fileList[0].file
}

const onEvaluateFileChange = (fileList: UploadFileInfo[]) => {
  if (!fileList.length) {
    modelSettings.dataset.evaluateFile = undefined
    return
  }
  modelSettings.dataset.evaluateFile = fileList[0].file
}

watchEffect(() => {
  if (globalStateStore.doTaskAssignFormValidate) {
    if (
      !modelSettings.dataset.trainFile ||
      !modelSettings.dataset.evaluateFile
    ) {
      globalStateStore.taskAssignFormValid = false
      message.error('请上传数据集')
    }
  }

  // 表单验证
  formItemRef.value?.validate().catch(() => {
    globalStateStore.taskAssignFormValid = false
  })
})
</script>
