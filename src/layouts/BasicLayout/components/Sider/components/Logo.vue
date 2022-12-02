<template>
  <router-link to="/">
    <div class="app-logo">
      <div>
        <img class="logo-img" src="@/assets/logo.png" />
      </div>
      <div v-if="!layoutStore.isCollapsed" class="app-name">
        {{ APP_NAME }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import useStyleStore from '@/store/modules/style'
import { APP_NAME } from '@/constants/global'

const layoutStore = useStyleStore()
</script>

<style scoped lang="scss">
.app-logo {
  height: var(--height-header-controllers);
  display: flex;
  align-items: center;
  justify-content: center;
  color: green;

  .logo-img {
    display: flex;
    align-items: center;
    height: 36px;
  }

  .app-name {
    margin-left: 10px;
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
