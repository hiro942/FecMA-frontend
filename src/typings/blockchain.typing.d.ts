declare namespace BlockchainModels {
  type Block = {
    blockNumber: number
    channelName: string
    numberOfTx: number
    dataHash: string
    blockHash: string
    previousHash: string
    transactions: []
    size: number
    createdAt: string
  }

  type Transaction = {
    transactionID: string
    creatorMSP: string
    endorser: string
    chaincodeName: string
    time: string
    reads: any
    writes: any
  }
}
