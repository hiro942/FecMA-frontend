<template>
  <n-card>
    <n-data-table
      :columns="tableColumns"
      :data="blocks"
      :pagination="{ pageSize: 15 }"
      :bordered="false"
    />

    <TransactionModal
      v-if="globalStateStoreStore.transactionModalVisible"
      :transaction="selectedTransaction"
    />
  </n-card>
</template>

<script setup lang="ts">
import TransactionModal from '@/views/blockchain/TransactionModal.vue'
import { h, onBeforeMount, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, useMessage } from 'naive-ui'
import { fetchBlockList } from '@/api/blockchain'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'

const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

type TableData = BlockchainModels.Block

const blocks = ref<BlockchainModels.Block[]>([])
onBeforeMount(async () => {
  try {
    blocks.value = (await fetchBlockList()).blockInfo
  } catch (err: any) {
    message.error(err.message)
  }
})

const selectedTransaction = ref()

const tableColumns: DataTableColumns<TableData> = [
  {
    title: AliasCN.blockNumber,
    key: 'blockNumber',
    align: 'center',
    width: 100,
  },
  {
    title: AliasCN.blockTransactionCount,
    key: 'blockTransactionCount',
    align: 'center',
    width: 100,
  },
  {
    title: AliasCN.currentHash,
    key: 'currentHash',
    align: 'center',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: AliasCN.dataHash,
    key: 'dataHash',
    align: 'center',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: AliasCN.previousHash,
    key: 'previousHash',
    align: 'center',
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: AliasCN.transactionInfo,
    key: 'action',
    align: 'center',
    ellipsis: {
      tooltip: true,
    },
    render(row: TableData) {
      return row.transactionInfo.length
        ? h(
            NButton,
            {
              text: true,
              color: '#2080F0',
              onClick: async () => {
                selectedTransaction.value = row.transactionInfo[0]
                globalStateStoreStore.transactionModalVisible = true
              },
            },
            { default: () => row.transactionInfo[0].transactionID }
          )
        : '无'
    },
  },
]
</script>