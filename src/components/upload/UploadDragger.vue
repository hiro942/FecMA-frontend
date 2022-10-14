<template>
  <n-upload multiple directory-dnd :max="1" @update:file-list="onFileChange">
    <n-upload-dragger>
      <div style="margin-bottom: 12px">
        <n-icon size="36" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text style="font-size: 15px">
        点击或者拖动
        <em style="color: darkcyan">{{ filename }}</em>
        文件到该区域来上传
      </n-text>
      <n-p depth="3" style="margin: 8px 0 0 0; font-size: 10px">
        {{ tip }}
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { UploadFileInfo } from 'naive-ui'

defineProps<{
  filename: string
  tip: string
  onFileChange: (fileList: UploadFileInfo[]) => void
}>()
</script>
