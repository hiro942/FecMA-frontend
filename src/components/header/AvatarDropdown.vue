<template>
  <el-dropdown class="avatar-dropdown" @command="handleCommand">
    <div class="user-dropdown">
      <el-avatar
        class="user-avatar"
        :size="35"
        :src="
          userStore.userInfo.avatarUrl
            ? userStore.userInfo.avatarUrl
            : DEFAULT_AVATAR
        "
      />
      <span class="user-nickname">{{ userStore.userInfo.nickname }}</span>
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :icon="HomeFilled" command="userInfo">
          个人信息
        </el-dropdown-item>
        <!-- <el-dropdown-item :icon="Tools"> 个人设置 </el-dropdown-item> -->
        <el-dropdown-item :icon="UserFilled" command="logout" divided>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ArrowDown, HomeFilled, UserFilled } from '@element-plus/icons-vue'
import { DEFAULT_AVATAR } from '@/constants'
import useUserStore from '@/store/modules/user'
import router from '@/router'

const userStore = useUserStore()

// 处理下拉菜单指令
const handleCommand = async (command: string | number | object) => {
  if (command === 'userInfo') {
    await router.push({ name: 'Person' })
  }
  if (command === 'logout') {
    await userStore.doLogout()
  }
}
</script>

<script lang="ts">
export default {
  name: 'AvatarDropdown',
}
</script>

<style scoped lang="scss">
.avatar-dropdown {
  margin-left: 15px;

  .user-dropdown {
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-nickname {
      margin-left: 10px;
    }
  }
}
</style>
