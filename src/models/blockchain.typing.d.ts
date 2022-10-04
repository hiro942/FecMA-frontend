declare namespace BlockchainModels {
  type Block = {
    blockNumber: number
    channelName: string
    numberOfTx: number
    dataHash: string
    blockHash: string
    previousHash: string
    transactions: string
    size: number
    createdAt: string
  }

  type Transaction = {
    transactionID: string
    creatorMSP: string
    endorser: string
    chaincodeName: string
    type: string // 交易类型，如 ENDORSER_TRANSACTION
    time: string
    reads: any
    writes: any
  }
}
