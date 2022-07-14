<template>
  <el-table
    :data="messages"
    style="width: 100%"
    height="250"
    :show-header="false"
  >
    <el-table-column prop="date" label="Date" width="150" />
    <el-table-column prop="content" label="Address" width="600" />
  </el-table>
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
