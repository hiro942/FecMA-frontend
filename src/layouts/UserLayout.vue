<template>
  <el-container class="user-layout">
    <el-header class="app-header">
      <img class="img-logo" src="@/assets/logo.png" alt="logo" />
    </el-header>

    <el-main class="app-main">
      <router-view />
    </el-main>

    <el-footer class="app-footer">
      <global-footer />
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import GlobalFooter from '@/components/layout/GlobalFooter.vue'
</script>

<script lang="ts">
export default {
  components: {},
}
</script>
<style scoped lang="scss">
.user-layout {
  align-items: center;
  justify-content: center;
  margin-top: 50px;

  .app-header {
    height: 100px;
    .img-logo {
      height: 100%;
    }
  }

  .app-main {
    min-width: 340px;
  }

  .app-footer {
    padding-top: 30px;
  }
}
</style>
