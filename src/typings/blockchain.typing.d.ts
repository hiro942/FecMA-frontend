declare namespace BlockchainModels {
  type Blockchain = {
    blockCount: number
    peerCount: number
    transactionCount: number
    blockInfo: Block[]
  }

  type Block = {
    blockNumber: number
    channelName: string
    blockTransactionCount: number
    dataHash: string
    currentHash: string
    previousHash: string
    transactionInfo: Transaction[]
  }

  type Transaction = {
    chaincodeName: string
    creatorMSP: string
    endorser: string[]
    transactionID: string
    transactionTimestamp: string
  }
}
