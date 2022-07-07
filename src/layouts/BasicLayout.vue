<template>
  <el-container
    class="app-container"
    :class="layoutStore.isCollapsed ? 'fold' : 'expand'"
  >
    <el-aside class="app-left-container">
      <global-menu />
    </el-aside>
    <el-container class="app-right-container">
      <global-header />
      <el-main class="app-main">
        <div class="main-content">
          <suspense>
            <router-view />
          </suspense>
        </div>
      </el-main>
      <el-footer class="app-footer">
        <global-footer />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import GlobalHeader from '@/components/layout/GlobalHeader.vue'
import GlobalMenu from '@/components/layout/GlobalSider.vue'
import GlobalFooter from '@/components/layout/GlobalFooter.vue'
import useLayoutStore from '@/store/modules/layout'

const layoutStore = useLayoutStore()

// 初始化页面resize回调
onMounted(() => {
  window.onresize = () => {
    const screenWidth = document.body.offsetWidth
    layoutStore.isCollapsed = screenWidth < 1200
  }
})
</script>

<style scoped lang="scss">
.app-container {
  height: 100%;
  width: 100%;

  &.fold {
    .app-left-container {
      width: var(--width-menu-fold);
    }

    .app-right-container {
      margin-left: var(--width-menu-fold);
    }

    .app-header {
      width: calc(100% - var(--width-menu-fold));
    }
  }

  &.expand {
    .app-left-container {
      width: var(--width-menu-expand);
    }

    .app-right-container {
      margin-left: var(--width-menu-expand);

      .app-header {
        width: calc(100% - var(--width-menu-expand));
      }
    }
  }
}

.app-left-container {
  height: 100%;
  position: fixed;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-aside);
}

.app-right-container {
  height: 100%;

  .app-main {
    margin-top: var(--height-header);
    background-color: var(--bg-color-main);

    .main-content {
      padding: 20px;
      background-color: #fff;
    }
  }

  .el-footer {
    padding-top: 10px;
    background-color: var(--bg-color-main);
  }
}
</style>
