<template>
  <div>
    <n-data-table
      :columns="tableColumns"
      :data="blocks"
      :pagination="{ pageSize: 15 }"
      :bordered="false"
    />

    <BlockDetailModal
      v-if="globalStateStore.blockDetailModalVisible"
      :block="selectedBlock"
    />

    <TransactionModal
      v-if="globalStateStore.transactionModalVisible"
      :transaction="selectedTransaction"
    />
  </div>
</template>

<script setup lang="ts">
import TransactionModal from '@/views/blockchain/components/TransactionModal.vue'
import BlockDetailModal from '@/views/blockchain/components/BlockDetailModal.vue'
import { ref, h, onBeforeMount } from 'vue'
import { useMessage, NButton } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { AliasCN } from '@/constants/alias'
import { fetchBlockList, fetchTransaction } from '@/api/blockchain'
import useGlobalStateStore from '@/store/modules/globalState'

const message = useMessage()
const globalStateStore = useGlobalStateStore()

type TableData = BlockchainModels.Block

const selectedBlock = ref()
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
    render(row: TableData) {
      return h(
        NButton,
        {
          text: true,
          color: '#2080F0',
          onClick: async () => {
            selectedBlock.value = row
            globalStateStore.blockDetailModalVisible = true
          },
        },
        { default: () => row.blockHash }
      )
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
            selectedTransaction.value = await fetchTransaction()
            globalStateStore.transactionModalVisible = true
          },
        },
        { default: () => row.transactions }
      )
    },
  },
  {
    title: `${AliasCN.size} (KB)`,
    key: 'size',
    align: 'center',
    width: 70,
  },
]

const blocks = ref()
onBeforeMount(async () => {
  blocks.value = await fetchBlockList()
})
</script>

<style scoped></style>
