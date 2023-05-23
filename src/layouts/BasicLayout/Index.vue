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
import Header from '@/layouts/BasicLayout/Header/Index.vue'
import Content from '@/layouts/BasicLayout/Content.vue'
import Footer from '@/layouts/BasicLayout/Footer.vue'
import Sider from '@/layouts/BasicLayout/Sider/Index.vue'
import { useLoadingBar } from 'naive-ui'
import { useRouter } from 'vue-router'
import useStyleStore from '@/store/style'
import { watch } from '@vue/runtime-core'
import request from '@/plugins/request'
import useGlobalStateStore from '@/store/globalState'
import style from '@/store/style'

const router = useRouter()
const loadingBar = useLoadingBar()
const styleStore = useStyleStore()

router.beforeEach(() => {
  loadingBar.start()
})

router.afterEach(() => {
  loadingBar.finish()
})

watchEffect(() => {
  if (useGlobalStateStore().requestingCnt === 0) {
    styleStore.showLoading = false
  }
})
</script>
