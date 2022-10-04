<template>
  <n-layout has-sider position="absolute" style="height: 100vh">
    <Sider />
    <n-layout>
      <Header />
      <Content />
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import Header from '@/layouts/BasicLayout/components/Header/Header.vue'
import Content from '@/layouts/BasicLayout/components/Content.vue'
import Footer from '@/layouts/BasicLayout/components/Footer.vue'
import Sider from '@/layouts/BasicLayout/components/Sider/Sider.vue'
</script>

<style scoped></style>
