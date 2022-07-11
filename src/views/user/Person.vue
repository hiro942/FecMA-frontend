<template>
  <template v-for="(val, key) in userInfo" :key="key">
    <div v-if="key !== 'partyID'" class="user-info-item">
      <div style="font-size: 20px; font-weight: bold">{{ AliasCN[key] }}</div>
      <div style="display: flex">
        <div v-if="!val" style="flex: 1">无</div>
        <div v-else style="flex: 1">{{ val }}</div>
        <el-button link type="primary" @click="onClick">修改</el-button>
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/modules/user'
import { AliasCN } from '@/constants'

const userStore = useUserStore()
const { userInfo } = userStore

// TODO: 修改用户信息
const onClick = () => {}
</script>

<script lang="ts">
export default {
  name: 'Person',
}
</script>

<style scoped lang="scss">
.user-info-item {
  text-align: left;
  padding: 20px;
  margin: 10px 0;
}
</style>
