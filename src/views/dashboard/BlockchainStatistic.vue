<template>
  <n-card>
    <n-list hoverable show-divider>
      <n-list-item>
        <n-space justify="space-between" align="center">
          <div class="py-3.5">联盟节点数</div>
          <div class="py-3.5 font-bold text-2xl">
            {{ blockchainInfo?.peerCount }}
          </div>
        </n-space>
      </n-list-item>
      <n-list-item>
        <n-space justify="space-between" align="center">
          <div class="py-5">区块数</div>
          <div class="py-5 font-bold text-2xl">
            {{ blockchainInfo?.blockCount }}
          </div>
        </n-space>
      </n-list-item>
      <n-list-item>
        <n-space justify="space-between" align="center">
          <div class="py-4">交易数</div>
          <div class="py-4 font-bold text-2xl">
            {{ blockchainInfo?.transactionCount }}
          </div>
        </n-space>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { fetchBlockList } from '@/api/blockchain'
import { useMessage } from 'naive-ui'

const message = useMessage()
const blockchainInfo = ref<BlockchainModels.Blockchain>()

onBeforeMount(async () => {
  try {
    blockchainInfo.value = await fetchBlockList()
  } catch (err: any) {
    message.error(err.message)
  }
})
</script>