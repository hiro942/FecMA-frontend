<template>
  <div class="el-upload__text">
    拖拽文件至此 or <em>点击选择上传文件</em><br />
    <span class="tip">提示：文件须为 csv 格式</span>
  </div>
</template>

<script setup lang="ts"></script>

<script lang="ts">
export default {
  name: 'UploadContent',
}
</script>

<style scoped>
.tip {
  color: #aaa;
  font-size: small;
}
</style>
