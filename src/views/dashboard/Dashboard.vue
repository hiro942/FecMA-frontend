<template>
  <div class="dashboard">
    <div class="area34">
      <div class="area3">area3</div>
      <div class="area4">area4</div>
    </div>
    <div class="area2">area2</div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
.dashboard {
  .area34 {
    height: 450px;
    display: flex;
    .area3 {
      width: 75%;
      background-color: purple;
    }

    .area4 {
      width: 25%;

      background-color: aqua;
    }
  }

  .area2 {
    height: 400px;
    background-color: pink;
  }
}
</style>
