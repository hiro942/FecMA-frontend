<template>
  <router-link :to="{ name: 'Dashboard' }">
    <div class="flex justify-center items-center my-1 text-black">
      <n-image preview-disabled :src="fedmaLogo" class="h-[44px]" />
      <div v-if="!styleStore.isCollapsed" class="font-bold text-3xl ml-5">
        {{ APP_NAME }}
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import fedmaLogo from '@/assets/fedma.png'
import useStyleStore from '@/store/style'
import { APP_NAME } from '@/configs/app'

const styleStore = useStyleStore()
</script>
