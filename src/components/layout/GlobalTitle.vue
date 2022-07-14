<template>
  <router-link to="/">
    <div class="app-title">
      <img class="app-logo" src="@/assets/logo.png" alt="logo" />
      <div v-if="!layoutStore.isCollapsed" class="app-name">
        {{ APP_NAME }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import useStyleStore from '@/store/modules/style'
import { APP_NAME } from '@/constants'

const layoutStore = useStyleStore()
</script>

<script lang="ts">
export default {
  name: 'GlobalTitle',
}
</script>

<style scoped lang="scss">
.app-title {
  height: var(--height-header-info);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  .app-logo {
    height: 28px;
  }

  .app-name {
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
