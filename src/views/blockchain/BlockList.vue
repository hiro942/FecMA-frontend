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
import { ref, h, onBeforeMount } from 'vue'
import { useMessage, NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { fetchBlockList, fetchTransaction } from '@/api/blockchain'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN } from '@/configs/maps'

const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

type TableData = BlockchainModels.Block

const blocks = ref<BlockchainModels.Block[]>([])
onBeforeMount(async () => {
  try {
    blocks.value = await fetchBlockList()
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
    width: 70,
  },
  {
    title: AliasCN.channelName,
    key: 'channelName',
    align: 'center',
    width: 70,
  },
  {
    title: AliasCN.numberOfTx,
    key: 'numberOfTx',
    align: 'center',
    width: 70,
  },
  {
    title: AliasCN.blockHash,
    key: 'blockHash',
    align: 'center',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: AliasCN.previousHash,
    key: 'previousHash',
    align: 'center',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: AliasCN.transactions,
    key: 'transactions',
    align: 'center',
    width: 100,
    ellipsis: {
      tooltip: true,
    },
    render(row: TableData) {
      return h(
        NButton,
        {
          text: true,
          color: '#2080F0',
          onClick: async () => {
            try {
              selectedTransaction.value = await fetchTransaction()
            } catch (err: any) {
              message.error(err.message)
            }
            globalStateStoreStore.transactionModalVisible = true
          },
        },
        { default: () => row.transactions }
      )
    },
  },
  {
    title: AliasCN.createdAt,
    key: 'createdAt',
    align: 'center',
    width: 120,
  },
]
</script>
