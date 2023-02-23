<template>
  <n-loading-bar-provider>
    <n-config-provider :locale="zhCN">
      <n-notification-provider>
        <n-message-provider>
          <n-dialog-provider>
            <router-view />
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-config-provider>
  </n-loading-bar-provider>
</template>

<script setup lang="ts">
import { darkTheme, zhCN } from 'naive-ui'
</script>
