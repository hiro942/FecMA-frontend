<template>
  <n-space vertical align="center" justify="center">
    <n-image
      class="mt-8"
      width="130"
      :src="currentUser.avatarUrl"
      fallback-src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
    />
    <n-divider />
    <n-form
      ref="formRef"
      class="min-w-[400px]"
      :model="currentUser"
      label-placement="left"
      require-mark-placement="right-hanging"
    >
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="currentUser.email" readonly placeholder="" />
      </n-form-item>
      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="currentUser.nickname" readonly placeholder="" />
      </n-form-item>
      <n-form-item label="组织" path="org">
        <n-input v-model:value="currentUser.org" readonly placeholder="" />
      </n-form-item>
    </n-form>
  </n-space>
</template>

<script lang="ts" setup>
import useUserStore from '@/store/user'
import { useMessage } from 'naive-ui'

const message = useMessage()
const { currentUser } = useUserStore()
</script>