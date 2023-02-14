<template>
  <n-avatar size="large" :src="userStore.currentUser.avatarUrl" />
  <div class="flex flex-col">
    <span>你好, {{ userStore.currentUser.nickname }}</span>
  </div>
  <n-dropdown trigger="hover" :options="dropdownOptions" @select="handleSelect">
    <n-icon size="26" class="hover:rotate-90 duration-500 cursor-pointer">
      <CogSharp />
    </n-icon>
  </n-dropdown>
</template>

<script setup lang="ts">
import { h, Component } from 'vue'
import { NIcon } from 'naive-ui'
import { PersonCircleOutline, LogOutOutline, CogSharp } from '@vicons/ionicons5'
import useUserStore from '@/store/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const renderIcon = (icon: Component) => () =>
  h(NIcon, null, {
    default: () => h(icon),
  })

const dropdownOptions = [
  {
    label: '个人信息',
    key: 'profile',
    icon: renderIcon(PersonCircleOutline),
  },
  { label: '退出登录', key: 'logout', icon: renderIcon(LogOutOutline) },
]

// 处理下拉菜单指令
const handleSelect = async (key: string | number) => {
  if (key === 'profile') {
    await router.push({ name: 'Space' })
  }
  if (key === 'logout') {
    await userStore.doLogout()
  }
}
</script>
