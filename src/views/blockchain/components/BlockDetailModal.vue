<template>
  <n-modal
    v-model:show="globalState.blockDetailModalVisible"
    preset="card"
    style="width: 600px"
    title="区块详情"
    size="huge"
    :bordered="false"
  >
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 130px"
    >
      <n-descriptions-item :label="AliasCN.type">
        {{ block.channelName }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.type">
        {{ block.blockNumber }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.time">
        {{ block.createdAt }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.chaincodeName">
        {{ block.numberOfTx }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.transactionID">
        {{ block.dataHash }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.creatorMSP">
        {{ block.blockHash }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.endorser">
        {{ block.previousHash }}
      </n-descriptions-item>
    </n-descriptions>
  </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/modules/globalState'
import { AliasCN } from '@/constants/alias'

const globalState = useGlobalStateStore()
const message = useMessage()

defineProps<{ block: BlockchainModels.Block }>()
</script>

<style scoped></style>
