<template class="bg-yellow-50">
  <n-image-group>
    <n-image
      class="logo gperf"
      preview-disabled
      :src="gperfLogo"
      @click="moveToGPerf"
    />
    <n-image
      class="logo fedma"
      preview-disabled
      :src="fedmaLogo"
      @click="moveToFedMA"
    />
  </n-image-group>

  <div class="text-center">
    <n-h1>GPerf + FedMA</n-h1>

    <n-p>
      进入
      <n-button text type="info" @click="moveToGPerf"> GPerf</n-button>
      , 主动测量系统
    </n-p>
    <n-p>
      进入
      <n-button text type="info" @click="moveToFedMA"> FedMA</n-button>
      , 测量分析系统
    </n-p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import gperfLogo from '@/assets/gperf.png'
import fedmaLogo from '@/assets/fedma.png'

const router = useRouter()

const moveToGPerf = () => {
  window.location.assign('http://10.99.12.101:11192')
}

const moveToFedMA = () => {
  router.push({ name: 'Dashboard' })
}
</script>

<style scoped>
.logo {
  height: 12em;
  padding: 1.5em;
  will-change: filter;
}

.logo.gperf:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.logo.fedma:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo:hover {
  cursor: pointer;
}
</style>
