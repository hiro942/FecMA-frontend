<template>
  <n-form ref="lstmFormRef" :label-width="80" :model="lstm">
    <n-form-item label="神经元" path="units">
      <n-input-number v-model:value="lstm.units" placeholder="请输入" min="1" />
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
defineProps<{ lstm: any }>()
</script>
