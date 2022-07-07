<template>
  <div class="additional-operations">
    <el-input
      v-model="searchContent"
      class="search-bar"
      placeholder="按任务名搜索"
    >
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>

    <el-select
      v-if="props.isMytaskList"
      v-model="selectedState"
      class="filter-bar"
      clearable
      placeholder="按任务状态筛选"
    >
      <template #prefix>
        <el-icon><Filter /></el-icon>
      </template>
      <el-option
        v-for="item in stateFilterOptions"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <div style="flex: 1"></div>

    <el-button
      class="task-assign-btn"
      type="danger"
      @click="() => router.push('/federate-learning/task-assign')"
    >
      <el-icon style="margin-right: 10px"><Plus /></el-icon>创建任务
    </el-button>
  </div>

  <el-table
    :data="currentPageData"
    :header-cell-style="tableHeaderCellStyle"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      v-for="label in tableColumns"
      :key="label"
      :label="AliasCN[label]"
      :prop="label"
      align="center"
    />

    <el-table-column
      key="peersRatio"
      :label="AliasCN['peersRatio']"
      prop="peersRatio"
      align="center"
    >
      <template #default="scope">
        <!-- TODO: 这里返回的内容不包括自身, 需要 + 1-->
        {{ scope.row.currentNumber as number + 1 }} /
        {{ scope.row.numberOfPeers as number + 1 }}
      </template>
    </el-table-column>

    <el-table-column
      v-if="props.isMytaskList"
      key="state"
      :label="AliasCN['state']"
      prop="state"
      align="center"
    >
      <template #default="scope">
        <el-tag :type="AliasCN[scope.row.state].type">
          {{ AliasCN[scope.row.state].text }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column
      key="operations"
      label="操作"
      prop="operations"
      align="center"
      :width="searchBarWidth"
    >
      <template #default="scope">
        <el-button link type="primary" @click="viewTaskDetail(scope.row)">
          任务详情
          <el-icon class="btn-icon"><DArrowRight /></el-icon>
        </el-button>
        <el-button
          v-if="showBtnStartTask(scope.row)"
          link
          type="danger"
          :disabled="scope.row.state !== 'ASSIGNED'"
          @click="handleTrain(scope.row)"
        >
          开始任务
          <el-icon class="btn-icon"><SwitchButton /></el-icon>
        </el-button>
        <el-button
          v-else-if="props.isMytaskList"
          link
          type="success"
          :disabled="scope.row.state !== 'FINISHED'"
          @click="viewTaskResult(scope.row)"
        >
          查看结果
          <el-icon class="btn-icon"><View /></el-icon>
        </el-button>
        <el-button
          v-if="!props.isMytaskList"
          link
          type="danger"
          @click="handleAccept(scope.row)"
        >
          接收任务
          <el-icon class="btn-icon"><CirclePlus /></el-icon>
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="pagination">
    <el-config-provider :locale="locale">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[30, 50, 100]"
        :total="filteredTasks.length"
        background
        layout="total, prev, sizes, pager, next, jumper"
      />
    </el-config-provider>
  </div>

  <task-detail-dialog
    v-if="selectedTaskDetail"
    :task-detail="selectedTaskDetail"
  />
  <task-accept-dialog
    v-if="seletedTask && seletedTask.modelID"
    :model-id="seletedTask.modelID"
  />
  <task-result-dialog
    v-if="selectedTaskModel"
    :model-info="selectedTaskModel"
  />
</template>

<script lang="ts" setup>
import { AliasCN } from '@/constants'
import TaskDetailDialog from '@/components/fLearning/TaskDetailDialog.vue'
import TaskAcceptDialog from '@/components/fLearning/TaskAcceptDialog.vue'
import TaskResultDialog from '@/components/fLearning/TaskResultDialog.vue'
import {
  Search,
  Plus,
  DArrowRight,
  CirclePlus,
  View,
  SwitchButton,
  Filter,
} from '@element-plus/icons-vue'
import { fetcTaskDetail, taskTrain, fetchModel } from '@/api/fLearning'
import {
  computed,
  ref,
  defineProps,
  watchEffect,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'
import router from '@/router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import useLayoutStore from '@/store/modules/layout'
import useGlobalStateStore from '@/store/modules/globalState'
import { tableHeaderCellStyle } from '@/utils/style'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // locale

const props = defineProps<{
  tasks: FLearningAPI.TaskInfo[]
  isMytaskList: boolean
}>()

const globalStateStore = useGlobalStateStore()
const layoutStore = useLayoutStore()
const locale = zhCn // 汉化 pagination 组件

const stateFilterOptions = [
  // { value: 'Option1', label: 'Option1', disabled: true },
  { value: 'ASSIGNED', label: '待开始' },
  { value: 'TRAINED', label: '进行中' },
  { value: 'FINISHED', label: '已完成' },
]
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: FLearningAPI.TaskInfo
  rowIndex: number
}) => {
  if (row.identity === 'assigner') {
    return 'warning-row'
  }
  return ''
}

const selectedState = ref('')
const tableColumns = ['taskName', 'assignDateTime', 'timeLimit']
const searchContent = ref('') // 搜索关键词
const searchBarWidth = '250' // 搜索框宽度
const pageSize = ref(15) // 页条目数
const currentPage = ref(1) // 当前页数
const currentPageData = ref() // 当前页数据

const seletedTask = ref() // 选择的任务
const selectedTaskDetail = ref() // 选择的任务详情
const selectedTaskModel = ref() // 选择的任务模型

// 是否显示[开始任务]按钮
const showBtnStartTask = (task: FLearningAPI.TaskInfo) =>
  props.isMytaskList &&
  task.state === 'ASSIGNED' &&
  task.identity === 'assigner'

// 根据任务名过滤后的数据
const filteredTasks = computed(() =>
  props.tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchContent.value.toLowerCase()) &&
      task.state.includes(selectedState.value),
  ),
)

// 获取当前页数据
const getCurrentPageData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  currentPageData.value = filteredTasks.value.slice(
    startIndex,
    startIndex + pageSize.value,
  )
}

// [Button]: 任务详情
const viewTaskDetail = async (task: FLearningAPI.TaskInfo) => {
  try {
    selectedTaskDetail.value = await fetcTaskDetail(task.modelID, task.partyID)
    layoutStore.taskDetailDialogVisible = true
  } catch (err) {
    ElMessage.error('服务器出现错误')
  }
}

// [Button]: 任务接收
const handleAccept = (task: FLearningAPI.TaskInfo) => {
  seletedTask.value = task
  layoutStore.taskAcceptDialogVisible = true
}

// [Button]: 查看任务结果
const viewTaskResult = async (task: FLearningAPI.TaskInfo) => {
  // seletedTaskIndex.value = index
  // selectedTaskModel.value = await fetchModel(filteredTasks.value[index].modelID)
  // TODO: 暂时使用假数据
  const modelInfoTest = {
    anonymousNameMapping: {},
    bestIteration: -1,
    classes: ['0', '1'],
    featureImportances: [
      {
        fid: 18,
        fullname: 'x18',
        importance: 5.0,
        importance2: 3179.525225857,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 19,
        fullname: 'x19',
        importance: 2.0,
        importance2: 509.8697233143,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 20,
        fullname: 'x20',
        importance: 2.0,
        importance2: 101.2239560645,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 13,
        fullname: 'x13',
        importance: 2.0,
        importance2: 76.8044301222,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 7,
        fullname: 'x7',
        importance: 2.0,
        importance2: 65.9686476161,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 10,
        fullname: 'x10',
        importance: 2.0,
        importance2: 47.5646125887,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 9,
        fullname: 'x9',
        importance: 1.0,
        importance2: 90.3291961282,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 15,
        fullname: 'x15',
        importance: 1.0,
        importance2: 24.5968602849,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 22,
        fullname: 'x22',
        importance: 1.0,
        importance2: 76.722886152,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 14,
        fullname: 'x14',
        importance: 1.0,
        importance2: 14.5427269078,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 21,
        fullname: 'x21',
        importance: 1.0,
        importance2: 44.611955692,
        main: 'split',
        sitename: 'guest',
      },
      {
        fid: 0,
        fullname: 'x0',
        importance: 1.0,
        importance2: 19.3185476696,
        main: 'split',
        sitename: 'guest',
      },
    ],
    featureNameFidMapping: {
      0: 'x0',
      1: 'x1',
      10: 'x10',
      11: 'x11',
      12: 'x12',
      13: 'x13',
      14: 'x14',
      15: 'x15',
      16: 'x16',
      17: 'x17',
      18: 'x18',
      19: 'x19',
      2: 'x2',
      20: 'x20',
      21: 'x21',
      22: 'x22',
      3: 'x3',
      4: 'x4',
      5: 'x5',
      6: 'x6',
      7: 'x7',
      8: 'x8',
      9: 'x9',
    },
    initScore: [0.0],
    losses: [],
    modelName: 'homo_sbt',
    numClasses: 2,
    treeDim: 1,
    treeNum: 3,
    treePlan: [],
    trees: [
      {
        missingDirMaskdict: {},
        splitMaskdict: {},
        tree: [
          {
            bid: 0.9047122646969068,
            fid: 18,
            id: 0,
            isLeaf: false,
            leftNodeid: 1,
            missingDir: 1,
            rightNodeid: 2,
            sitename: 'guest',
            weight: -1.1099722507,
          },
          {
            bid: 1.573512813942988,
            fid: 19,
            id: 1,
            isLeaf: false,
            leftNodeid: 3,
            missingDir: 1,
            rightNodeid: 4,
            sitename: 'guest',
            weight: -1.3279807531,
          },
          {
            bid: -0.695773484744511,
            fid: 20,
            id: 2,
            isLeaf: false,
            leftNodeid: 5,
            missingDir: 1,
            rightNodeid: 6,
            sitename: 'guest',
            weight: 0.7213345864,
          },
          {
            bid: -0.29680099894987155,
            fid: 9,
            id: 3,
            isLeaf: false,
            leftNodeid: 7,
            missingDir: 1,
            rightNodeid: 8,
            sitename: 'guest',
            weight: -1.4333404797,
          },
          {
            bid: 1.4789320866372022,
            fid: 13,
            id: 4,
            isLeaf: false,
            leftNodeid: 9,
            missingDir: 1,
            rightNodeid: 10,
            sitename: 'guest',
            weight: -0.2164082688,
          },
          {
            bid: -0.34194199889079346,
            fid: 7,
            id: 5,
            isLeaf: false,
            leftNodeid: 11,
            missingDir: 1,
            rightNodeid: 12,
            sitename: 'guest',
            weight: -0.3619909503,
          },
          {
            bid: 1.452967081295793,
            fid: 15,
            id: 6,
            isLeaf: false,
            leftNodeid: 13,
            missingDir: 1,
            rightNodeid: 14,
            sitename: 'guest',
            weight: 0.7804757185,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 7,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.0811263829,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 8,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.5120287792,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 9,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.1517194876,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 10,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.679389313,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 11,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.5940594059,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 12,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.1570247934,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 13,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.8068153345,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 14,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.5217391305,
          },
        ],
      },
      {
        missingDirMaskdict: {},
        splitMaskdict: {},
        tree: [
          {
            bid: 0.01490308034690498,
            fid: 18,
            id: 0,
            isLeaf: false,
            leftNodeid: 1,
            missingDir: 1,
            rightNodeid: 2,
            sitename: 'guest',
            weight: -0.8141103752,
          },
          {
            bid: 0.23495892683718056,
            fid: 22,
            id: 1,
            isLeaf: false,
            leftNodeid: 3,
            missingDir: 1,
            rightNodeid: 4,
            sitename: 'guest',
            weight: -1.0784433969,
          },
          {
            bid: 0.9047122646969068,
            fid: 18,
            id: 2,
            isLeaf: false,
            leftNodeid: 5,
            missingDir: 1,
            rightNodeid: 6,
            sitename: 'guest',
            weight: 0.0379696666,
          },
          {
            bid: -0.8284113775077981,
            fid: 13,
            id: 3,
            isLeaf: false,
            leftNodeid: 7,
            missingDir: 1,
            rightNodeid: 8,
            sitename: 'guest',
            weight: -1.1130972789,
          },
          {
            bid: -1.2343229989289584,
            fid: 14,
            id: 4,
            isLeaf: false,
            leftNodeid: 9,
            missingDir: 1,
            rightNodeid: 10,
            sitename: 'guest',
            weight: -0.3235771388,
          },
          {
            bid: 0.18878682528213997,
            fid: 21,
            id: 5,
            isLeaf: false,
            leftNodeid: 11,
            missingDir: 1,
            rightNodeid: 12,
            sitename: 'guest',
            weight: -0.367761811,
          },
          {
            bid: 0.2531789084829441,
            fid: 0,
            id: 6,
            isLeaf: false,
            leftNodeid: 13,
            missingDir: 1,
            rightNodeid: 14,
            sitename: 'guest',
            weight: 0.5135569373,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 7,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.8848689007,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 8,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -1.1874930898,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 9,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.0715876164,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 10,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.6089198436,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 11,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.5301045938,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 12,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.1914126094,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 13,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.3315875605,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 14,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.7671721303,
          },
        ],
      },
      {
        missingDirMaskdict: {},
        splitMaskdict: {},
        tree: [
          {
            bid: 0.01490308034690498,
            fid: 18,
            id: 0,
            isLeaf: false,
            leftNodeid: 1,
            missingDir: 1,
            rightNodeid: 2,
            sitename: 'guest',
            weight: -0.6261593439,
          },
          {
            bid: 0.138904674809873,
            fid: 20,
            id: 1,
            isLeaf: false,
            leftNodeid: 3,
            missingDir: 1,
            rightNodeid: 4,
            sitename: 'guest',
            weight: -0.843946867,
          },
          {
            bid: -0.7231682691788779,
            fid: 19,
            id: 2,
            isLeaf: false,
            leftNodeid: 5,
            missingDir: 1,
            rightNodeid: 6,
            sitename: 'guest',
            weight: 0.0273470721,
          },
          {
            bid: -0.237695039685139,
            fid: 7,
            id: 3,
            isLeaf: false,
            leftNodeid: 7,
            missingDir: 1,
            rightNodeid: 8,
            sitename: 'guest',
            weight: -0.8857719146,
          },
          {
            bid: -0.247824705203846,
            fid: 10,
            id: 4,
            isLeaf: false,
            leftNodeid: 9,
            missingDir: 1,
            rightNodeid: 10,
            sitename: 'guest',
            weight: -0.182604961,
          },
          {
            bid: -0.3080629989550904,
            fid: 10,
            id: 5,
            isLeaf: false,
            leftNodeid: 11,
            missingDir: 1,
            rightNodeid: 12,
            sitename: 'guest',
            weight: -0.5001783626,
          },
          {
            bid: 0.9047122646969068,
            fid: 18,
            id: 6,
            isLeaf: false,
            leftNodeid: 13,
            missingDir: 1,
            rightNodeid: 14,
            sitename: 'guest',
            weight: 0.2214897652,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 7,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.6924350903,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 8,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.9869260199,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 9,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.1239539843,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 10,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.4603918454,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 11,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.1965495968,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 12,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.9676584514,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 13,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: -0.0601500899,
          },
          {
            bid: 0.0,
            fid: 0,
            id: 14,
            isLeaf: true,
            leftNodeid: -1,
            missingDir: 1,
            rightNodeid: -1,
            sitename: 'guest',
            weight: 0.4042842294,
          },
        ],
      },
    ],
    meta: {
      meta_data: {
        learningRate: 0.3,
        nIterNoChange: true,
        numTrees: 3,
        objectiveMeta: {
          objective: 'cross_entropy',
          param: [],
        },
        quantileMeta: {
          binNum: 32,
          quantileMethod: '',
        },
        taskType: 'classification',
        tol: 0.0001,
        treeMeta: {
          criterionMeta: {
            criterionMethod: 'xgboost',
            criterionParam: [0.1, 0.0],
          },
          maxDepth: 3,
          minImpuritySplit: 0.001,
          minLeafNode: 1,
          minSampleSplit: 2,
          useMissing: false,
          zeroAsMissing: false,
        },
        useMissing: false,
        workMode: '',
        zeroAsMissing: false,
      },
      module_name: 'HomoSecureboost',
    },
  }
  selectedTaskModel.value = modelInfoTest
  layoutStore.taskResultDialogVisible = true
}

// [Button]: 任务开始
const handleTrain = async (task: FLearningAPI.TaskInfo) => {
  ElMessageBox.confirm(
    '模型训练过程中不可暂停，是否确认开始任务？',
    'Warning',
    {
      confirmButtonText: '确认，开始任务',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async () => {
      /* TODO: 该参数目前固定 */
      const modelAndEvaluation = `{
    homo_secureboost_0: {
      task_type: 'classification',
      objective_param: { objective: 'cross_entropy' },
      num_trees: 3,
      validation_freqs: 1,
      tree_param: { max_depth: 3 },
    },
    evaluation_0: { eval_type: 'binary' },
  }`

      try {
        await taskTrain({
          modelID: task.modelID,
          modelAndEvaluation,
        })
        ElNotification.success('训练任务已启动')
      } catch (err: any) {
        ElNotification.error(err)
      }
    })
    .catch((err) => {})
}

watchEffect(() => {
  // 页号或页大小变动，重新获取页面数据
  if (currentPage.value || pageSize) {
    getCurrentPageData()
  }
})

onBeforeMount(() => {
  // 获取可能存在的筛选条件（eg: 从 dashboard 点击跳转）
  searchContent.value = globalStateStore.searchTaskName
  selectedState.value = globalStateStore.filterTaskState
})

onBeforeUnmount(() => {
  // 组件卸载前清空筛选条件
  globalStateStore.searchTaskName = ''
  globalStateStore.filterTaskState = ''
})
</script>

<script lang="ts">
export default {
  name: 'TaskList',
}
</script>

<style scoped lang="scss">
.additional-operations {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-end;

  .search-bar {
    width: 300px;
    margin-right: 10px;
  }

  .task-assign-btn {
    font-size: 16px;
    height: 40px;
    padding: 0 36px;
  }
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}

.btn-icon {
  margin-left: 5px;
}
</style>
