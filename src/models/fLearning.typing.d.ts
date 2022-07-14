declare namespace FLearningAPI {
  import { UploadRawFile } from 'element-plus'

  // 任务信息
  type TaskInfo = {
    taskName: string
    modelID: string
    partyID: string // 任务隶属组织
    assignDateTime: string
    identity?: string // 表示自己是人物创建者还是接收人 [assigner, acceptor]
    currentNumber: number
    numberOfPeers: number
    state: string
    timeLimit: number
  }

  // 任务详情
  type TaskDetail = {
    taskName: string
    modelID: string
    modelName: string
    createTime: string
    assigner: {
      nickname: string
      avatarUrl: string
      participateDateTime: string
    }
    acceptors: {
      nickname: string
      avatarUrl: string
      partyID: string
      participateDateTime: string
    }[]
    state: string
    timeLimit: number
    description: string
  }

  // [Params]:任务创建
  type TaskAssignParams = {
    taskName: string
    modelName: string
    numberOfPeers: number // 不包括自己。。
    // timeLimit: number
    description: string
    trainFile: UploadRawFile
    evaluateFile: UploadRawFile
  }

  // [Return]:任务创建
  type Callback = {
    queryURL: string
  }

  // [Params]:任务接收
  type TaskAcceptParams = {
    modelID: string
    trainFile: UploadRawFile
    evaluateFile: UploadRawFile
  }

  // [Params]:任务训练
  type TaskTrainParams = {
    modelID: string
    modelAndEvaluation: any
  }

  type ModelInfo = {
    anonymousNameMapping: any
    bestIteration: number
    classes: string[]
    featureImportances: {
      fid: number
      fullname: string
      importance: number
      importance2: number
      main: string
      sitename: string
    }[]
    featureNameFidMapping: any
    initScore: number[]
    losses: number[]
    modelName: string
    numClasses: number
    treeDim: number
    treeNum: number
    treePlan: number[]
    trees: {
      missingDirMaskdict: any
      splitMaskdict: any
      tree: {
        bid: number
        fid: number
        id: number
        isLeaf: boolean
        leftNodeid: number
        missingDir: number
        rightNodeid: number
        sitename: string
        weight: number
      }[]
    }[]
    meta: {
      meta_data: {
        learningRate: number
        nIterNoChange: boolean
        numTrees: number
        objectiveMeta: {
          objective: string
          param: number[]
        }
        quantileMeta: {
          binNum: number
          quantileMethod: string
        }
        taskType: string
        tol: number
        treeMeta: {
          criterionMeta: {
            criterionMethod: string
            criterionParam: number[]
          }
          maxDepth: number
          minImpuritySplit: number
          minLeafNode: number
          minSampleSplit: number
          useMissing: boolean
          zeroAsMissing: boolean
        }
        useMissing: boolean
        workMode: string
        zeroAsMissing: boolean
      }
      module_name: string
    }
  }
}
