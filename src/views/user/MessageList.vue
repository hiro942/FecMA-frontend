<template>
  <div>
    <n-button
      style="float: right"
      strong
      secondary
      type="error"
      size="large"
      @click="clearMessages"
    >
      <template #icon>
        <n-icon>
          <TrashBinOutline />
        </n-icon>
      </template>
      全部已读
    </n-button>

    <n-data-table :columns="tableColumns" :data="messages" />
  </div>
</template>

<script setup lang="ts">
import { TrashBinOutline } from '@vicons/ionicons5'
import useUserStore from '@/store/modules/user'
import { ref, watchEffect } from 'vue'

const userStore = useUserStore()
const messages = ref<UserModels.Message[]>([])

watchEffect(() => {
  messages.value = userStore.messages
})
console.log(messages)

const tableColumns = [
  { title: '时间', key: 'time', width: 300 },
  { title: '消息', key: 'content' },
]

const clearMessages = () => {
  userStore.messages = []

  // TODO: 发请求给服务器，服务器将该用户消息清空
}
</script>
