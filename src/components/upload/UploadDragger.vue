<template>
  <n-upload
    multiple
    directory-dnd
    :max="1"
    @update:file-list="onFileChange"
    @before-upload="onBeforeUpload"
  >
    <n-upload-dragger>
      <div class="mb-[12px]">
        <n-icon size="36" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text class="text-[15px]">
        点击或者拖动
        <em class="text-cyan-600">{{ filename }}</em>
        文件到该区域来上传
      </n-text>
      <n-p depth="3" class="mt-[8px] text-[10px]">
        {{ tip }}
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<script setup lang="ts">
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { UploadFileInfo, useNotification } from 'naive-ui'

const notification = useNotification()
const props = defineProps<{
  filetype: string
  filename: string
  tip?: string
  onFileChange: (fileList: UploadFileInfo[]) => void
}>()

const onBeforeUpload = (data: { file: UploadFileInfo }) => {
  console.log(data.file.file?.type)
  if (data.file.file?.type !== props.filetype) {
    notification.error({
      content: '上传文件格式错误',
      meta: `需要的数据集格式为 ${props.filetype}`,
      duration: 5000,
    })
    return false
  }
  return true
}
</script>
