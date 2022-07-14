<template>
  <!--  unique-opened-->
  <el-menu
    class="app-menu"
    :default-active="active"
    :default-openeds="['FederateLearning']"
    :collapse="layoutStore.isCollapsed"
    :collapse-transition="false"
    :background-color="layoutStore.asideBgColor"
    :text-color="layoutStore.asideColor"
    @select="selectMenuItem"
  >
    <el-menu-item index="Dashboard">
      <template #default>
        <el-icon>
          <house />
        </el-icon>
        <span>Dashboard</span>
      </template>
    </el-menu-item>

    <el-sub-menu index="FederateLearning">
      <template #title>
        <el-icon>
          <Document />
        </el-icon>
        <span>任务模块</span>
      </template>
      <el-menu-item index="TaskAssign"> 创建任务 </el-menu-item>
      <el-menu-item index="AllTask"> 任务列表 </el-menu-item>
      <el-menu-item index="MyTask"> 我的任务 </el-menu-item>
    </el-sub-menu>

    <!-- <el-sub-menu index="Blockchain">
      <template #title>
        <el-icon>
          <location />
        </el-icon>
        <span>区块链</span>
      </template>
      <el-menu-item index="????"> 组织信息???? </el-menu-item>
    </el-sub-menu> -->
  </el-menu>
</template>

<script setup lang="ts">
import { Document, House } from '@element-plus/icons-vue'
import useStyleStore from '@/store/modules/style'
import router from '@/router'
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'

const route = useRoute()
const layoutStore = useStyleStore()

const selectMenuItem = (menuIndex: string) => {
  router.push({ name: menuIndex })
}

const active = ref('')

watch(
  () => route,
  () => {
    active.value = route.name as string
  },
  { deep: true }
)

// 初始化active路由为当前路由
onMounted(() => {
  active.value = route.name as string
})
</script>

<script lang="ts">
export default {
  name: 'GlobalMenu',
}
</script>

<style scoped lang="scss">
.app-menu {
  border-color: transparent;
  font-weight: bold;
  user-select: none;
}
</style>
