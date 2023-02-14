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

      <n-descriptions-item :label="AliasCN.chaincodeName">
        {{ transaction.chaincodeName }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.creatorMSP">
        {{ transaction.creatorMSP }}
      </n-descriptions-item>

      <n-descriptions-item :label="AliasCN.endorser">
        {{ transaction.endorser }}
      </n-descriptions-item>

      <n-descriptions-item label="交易时间">
        {{ transaction.time }}
      </n-descriptions-item>
    </n-descriptions>
  </n-modal>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'

const globalState = useGlobalStateStore()
const message = useMessage()

defineProps<{ transaction: BlockchainModels.Transaction }>()
</script>
