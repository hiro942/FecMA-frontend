<template>
  <n-menu
    v-model:value="activeKey"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MenuOption, NIcon } from 'naive-ui'
import { menuRoutes } from '@/configs/routes'

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

const menuOptions: MenuOption[] = menuRoutes?.map((menuItem: any) => ({
  label: !menuItem?.children
    ? () =>
        h(
          RouterLink,
          {
            to: {
              name: menuItem.name,
            },
          },
          { default: () => menuItem.meta.title }
        )
    : () => menuItem.meta.title,
  key: menuItem.name,
  show: !menuItem.meta?.hideInMenu,
  icon: renderIcon(menuItem.meta?.icon),
  children: !menuItem?.children
    ? undefined
    : menuItem.children.map((subMenuItem: any) => ({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: subMenuItem.name,
              },
            },
            { default: () => subMenuItem.meta.title }
          ),
        key: subMenuItem.name,
        icon: renderIcon(subMenuItem.meta?.icon),
      })),
}))
</script>