<template>
  <el-button @click="clearMessages">全部已读</el-button>
  <div v-for="msg in messages" :key="msg">{{ msg }}</div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { LocalStorage, removeLocal } from '@/utils/localStorage'

const { messages } = useUserStore()

const clearMessages = () => {
  removeLocal(LocalStorage.Messages)
  useUserStore().updateMessages()
}
</script>

<script lang="ts">
export default {
  name: 'MessageList',
}
</script>

<style scoped></style>
