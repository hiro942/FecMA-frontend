<template>
  <el-dropdown @command="handleCommand">
    <div class="user-dropdown">
      <el-avatar class="user-avatar" :size="35" :src="DEFAULT_AVATAR" />
      <span class="user-nickname">{{ DEFAULT_NICKNAME }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="HomeFilled" command="info">
          个人信息
        </el-dropdown-item>
        <el-dropdown-item :icon="Tools"> 个人设置 </el-dropdown-item>
        <el-dropdown-item :icon="UserFilled" command="logout" divided>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import {
  ArrowDown,
  HomeFilled,
  Tools,
  UserFilled,
} from '@element-plus/icons-vue'
import { DEFAULT_AVATAR, DEFAULT_NICKNAME } from '@/constants'

// 处理下拉菜单指令
const handleCommand = (command: string | number | object) => {
  if (command === 'logout') {
    // todo 退出登录
    // logout()
  }
}
</script>

<script lang="ts">
export default {
  name: 'AvatarDropdown',
}
</script>

<style scoped lang="scss">
.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;

  .user-nickname {
    margin-left: 10px;
  }
}
</style>
