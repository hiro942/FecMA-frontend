<template>
  <n-alert type="warning" style="margin: 20px 0">
    请以文件压缩包的形式上传。除图片外，压缩文件内还应包含一个以
    <strong>[图片名称,标签名]</strong> 形式记录图片标签的CSV文件。
  </n-alert>

  <Dataset />

  <n-form-item
    label="图像裁剪大小"
    required
    label-placement="left"
    style="margin-top: 20px"
  >
    <n-input-number
      v-model:value="settings.processSize.width"
      :show-button="false"
      :min="1"
      style="width: 100px"
    >
      <template #suffix> px </template>
    </n-input-number>
    <span>&nbsp; ✖ &nbsp;️</span>
    <n-input-number
      v-model:value="settings.processSize.height"
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
      v-model:value="settings.interpolation"
      :options="interpolationOptions"
    />
  </n-form-item>
</template>

<script setup lang="ts">
import useModelSettings from '@/store/modules/modelSettings'
import Dataset from '@/views/task-assign/components/Dataset.vue'

const settings = useModelSettings().imageDatasetSettings

const interpolationOptions = [
  { value: 'INTER_LINEAR', label: '双线性插值' },
  { value: 'INTER_NEAREST', label: '最近邻插值' },
  { value: 'INTER_AREA', label: '像素区域关系重采样' },
  { value: 'INTER_CUBIC', label: '4*4像素领域的双三次插值' },
  { value: 'INTER_LANCZOS4', label: '8*8像素领域的Lanczos插值' },
]
</script>
