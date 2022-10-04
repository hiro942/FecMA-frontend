<template>
  <n-modal
    v-model:show="globalState.transactionModalVisible"
    preset="card"
    style="width: 600px"
    title="交易详情"
    size="huge"
    :bordered="false"
  >
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 130px"
    >
      <n-descriptions-item :label="AliasCN.transactionID">
        {{ transaction.transactionID }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.creatorMSP">
        {{ transaction.creatorMSP }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.endorser">
        {{ transaction.endorser }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.chaincodeName">
        {{ transaction.chaincodeName }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.type">
        {{ transaction.type }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.time">
        {{ transaction.time }}
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

defineProps<{ transaction: BlockchainModels.Transaction }>()
</script>
