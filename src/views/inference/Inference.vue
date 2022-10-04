<template>
  <div>
    <n-grid
      x-gap="24"
      y-gap="24"
      cols="1 600:2"
      style="max-width: 1000px; margin: auto"
    >
      <n-gi v-for="item in 8" :key="item">
        <div class="grid-item" />
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.grid-item {
  height: 200px;
  background-color: rgba(0, 128, 0, 0.24);

  border-radius: 0.3rem;
  cursor: pointer;
  position: relative;
  top: 0;
  box-shadow: 0.1rem 0.3rem 0.5rem rgba(0, 0, 0, 0.1);
  &:hover {
    top: -0.25rem;
    box-shadow: none;
  }
  transition: all 0.5s ease-out;
}
</style>
