<template>
  <n-grid class="outer-box" cols="3">
    <n-gi>
      <div class="label">联盟节点数</div>
      <div class="value">3</div>
    </n-gi>
    <n-gi>
      <div class="label">区块数</div>
      <div class="value">2</div>
    </n-gi>
    <n-gi>
      <div class="label">交易数</div>
      <div class="value">3</div>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts"></script>

<style scoped>
.outer-box {
  padding: 10px 0;
  border-radius: 10px;
  text-align: center;
  background: #eeefff;
}

.label {
  color: gray;
  font-size: 15px;
}

.value {
  font-size: 30px;
}
</style>
