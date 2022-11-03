<template>
  <n-layout has-sider position="absolute" style="height: 100vh">
    <Sider />
    <n-layout>
      <Header />
      <n-spin :show="styleStore.showLoading">
        <Content />
      </n-spin>
      <Footer />
    </n-layout>
  </n-layout>
</template>

<script lang="ts" setup>
import Header from '@/layouts/BasicLayout/components/Header/Header.vue'
import Content from '@/layouts/BasicLayout/components/Content.vue'
import Footer from '@/layouts/BasicLayout/components/Footer.vue'
import Sider from '@/layouts/BasicLayout/components/Sider/Sider.vue'
import { useLoadingBar } from 'naive-ui'
import { useRouter } from 'vue-router'
import useStyleStore from '@/store/modules/style'

const router = useRouter()
const loadingBar = useLoadingBar()
const styleStore = useStyleStore()

router.beforeEach(() => {
  loadingBar.start()
})

router.afterEach(() => {
  loadingBar.finish()
})
</script>
