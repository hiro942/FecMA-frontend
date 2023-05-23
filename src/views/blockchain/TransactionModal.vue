<template>
  <n-modal
    v-model:show="globalStateStore.transactionModalVisible"
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
        {{ dayjs(transaction.transactionTimestamp).format('YYYY-MM-DD HH:mm') }}
      </n-descriptions-item>
    </n-descriptions>
  </n-modal>
</template>

<script setup lang="ts">
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'

const globalStateStore = useGlobalStateStore()

defineProps<{ transaction: BlockchainModels.Transaction }>()
</script>