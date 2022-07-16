<template>
  <div id="message-list">
    <div class="header">
      <div class="title">消息列表</div>
      <div style="flex: 1"></div>
      <el-button
        type="danger"
        size="large"
        :icon="Delete"
        @click="clearMessages"
      >
        全部已读
      </el-button>
    </div>

    <el-table
      :data="messages"
      style="width: 100%"
      :show-header="false"
      empty-text="未收到新消息"
    >
      <el-table-column prop="date" label="Date" width="200" />
      <el-table-column prop="content" label="Address" width="600" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { LocalStorage, removeLocal } from '@/utils/localStorage'

const { messages } = useUserStore()

const clearMessages = () => {
  removeLocal(LocalStorage.Messages)
  useUserStore().updateMessages()
  window.location.reload()
}
</script>

<script lang="ts">
export default {
  name: 'MessageList',
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;

  .title {
    margin: 10px 10px;
    font-weight: bold;
    font-size: 25px;
  }

  .el-button {
  }
}
</style>
