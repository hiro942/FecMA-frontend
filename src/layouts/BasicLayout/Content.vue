<template>
  <n-layout-content class="h-[calc(100vh-130px)] bg-[#fafafa] p-3">
    <router-view v-if="!styleStore.isReloading" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <suspense>
          <keep-alive v-if="route.meta.keepAlive">
            <component :is="Component" />
          </keep-alive>
          <component :is="Component" v-else />
        </suspense>
      </transition>
    </router-view>
    <footer />
  </n-layout-content>
</template>

<script setup lang="ts">
import useStyleStore from '@/store/style'
import { useRoute } from 'vue-router'

const route = useRoute()
const styleStore = useStyleStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
