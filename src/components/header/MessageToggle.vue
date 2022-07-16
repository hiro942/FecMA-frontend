<template>
  <div id="message-toggle">
    <router-link :to="{ name: 'Message' }" style="color: #000">
      <el-badge :value="badgeVal">
        <el-tooltip effect="light" content="查看消息">
          <el-icon :size="20"><message /></el-icon>
        </el-tooltip>
      </el-badge>
    </router-link>
  </div>
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
#message-toggle {
  margin: 0 20px;
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
