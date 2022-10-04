<template>
  <n-menu
    v-model:value="activeKey"
    :collapsed="styleStore.isCollapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MenuOption, NIcon } from 'naive-ui'
import {
  AddOutline,
  GitNetworkOutline,
  HomeOutline,
  ListOutline,
  LogoTableau,
  AnalyticsOutline,
} from '@vicons/ionicons5'
import useStyleStore from '@/store/modules/style'

const styleStore = useStyleStore()

// 初始化页面resize回调
onMounted(() => {
  window.onresize = () => {
    const screenWidth = document.body.offsetWidth
    styleStore.isCollapsed = screenWidth < 1200
  }
})

const route = useRoute()

const activeKey = ref<string | null>(null)

watch(
  () => route,
  () => {
    activeKey.value = route.name as string
  },
  { deep: true }
)
// 初始化active路由为当前路由
onMounted(() => {
  activeKey.value = route.name as string
})

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Dashboard',
          },
        },
        { default: () => 'Dashboard' }
      ),
    key: 'Dashboard',
    icon: renderIcon(HomeOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'TaskAssign',
          },
        },
        { default: () => '创建任务' }
      ),
    key: 'TaskAssign',
    icon: renderIcon(AddOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'TaskExplore',
          },
        },
        { default: () => '搜索任务' }
      ),
    key: 'TaskExplore',
    icon: renderIcon(LogoTableau),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'MyTask',
          },
        },
        { default: () => '我的任务' }
      ),
    key: 'MyTask',
    icon: renderIcon(ListOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'Inference',
          },
        },
        { default: () => '模型推理' }
      ),
    key: 'Inference',
    icon: renderIcon(GitNetworkOutline),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'BlockChain',
          },
        },
        { default: () => '区块链信息' }
      ),
    key: 'BlockChain',
    icon: renderIcon(AnalyticsOutline),
  },
]
</script>
