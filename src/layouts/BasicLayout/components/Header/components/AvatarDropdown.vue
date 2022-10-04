<template>
  <div class="dada">
    <n-dropdown
      trigger="hover"
      :options="dropdownOptions"
      @select="handleSelect"
    >
      <n-space align="center">
        <n-avatar
          round
          class="user-avatar"
          size="large"
          :src="
            userStore.userInfo.avatarUrl
              ? userStore.userInfo.avatarUrl
              : DEFAULT_AVATAR
          "
        />
        <div class="user-nickname">{{ userStore.userInfo.nickname }}</div>
      </n-space>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
import { h, Component } from 'vue'
import { NIcon } from 'naive-ui'
import { PersonCircleOutline, LogOutOutline } from '@vicons/ionicons5'
import { DEFAULT_AVATAR } from '@/constants/global'
import useUserStore from '@/store/modules/user'
import router from '@/router'

const userStore = useUserStore()

const renderIcon = (icon: Component) => () =>
  h(NIcon, null, {
    default: () => h(icon),
  })

const dropdownOptions = [
  {
    label: '个人信息',
    key: 'user-info',
    icon: renderIcon(PersonCircleOutline),
  },
  { label: '退出登录', key: 'logout', icon: renderIcon(LogOutOutline) },
]

// 处理下拉菜单指令
const handleSelect = async (key: string | number) => {
  if (key === 'user-info') {
    await router.push({ name: 'Person' })
  }
  if (key === 'logout') {
    await userStore.doLogout()
  }
}
</script>

<style scoped lang="scss">
.dada {
  margin-left: 10px;
  margin-right: 20px;
  width: 100px;
}
</style>
