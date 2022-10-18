<template>
  <n-row>
    <n-col :span="12">
      <n-statistic label="我也不到啊" :value="99">
<!--        <template #prefix>-->
<!--          <n-icon>-->
<!--            <md-save />-->
<!--          </n-icon>-->
<!--        </template>-->
        <template #suffix>
          / 100
        </template>
      </n-statistic>
    </n-col>
    <n-col :span="12">
      <n-statistic label="区块数量">
        1,234,123
      </n-statistic>
    </n-col>
  </n-row>
</template>

<script setup lang='ts'>

</script>

<style scoped>

</style>