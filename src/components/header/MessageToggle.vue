<template>
  <router-link class="message-toggle" :to="{ name: 'Message' }" target="_blank">
    <el-badge :value="badgeVal">
      <el-icon :size="20"><message /></el-icon>
    </el-badge>
  </router-link>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Message } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { watchAsyncResult } from '@/utils/watchers'
import { LocalStorage } from '@/utils/localStorage'

const userStore = useUserStore()
const badgeVal = ref()

watchAsyncResult(LocalStorage.AssignResultCallback)
watchAsyncResult(LocalStorage.AcceptResultCallback)
watchAsyncResult(LocalStorage.TrainResultCallback)

watchEffect(() => {
  if (!userStore.messages.length) {
    badgeVal.value = ''
  } else {
    badgeVal.value = userStore.messages.length
  }
})
</script>

<script lang="ts">
export default {
  name: 'MessageToggle',
}
</script>

<style scoped lang="scss">
.message-toggle {
  color: #333;
  margin: 0 15px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
