<template>
  <div v-for="msg in messages" :key="msg">{{ msg }}</div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'

const { messages } = useUserStore()
</script>

<script lang="ts">
export default {
  name: 'MessageList',
}
</script>

<style scoped></style>
