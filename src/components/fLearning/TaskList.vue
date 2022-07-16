<template>
  <div id="task-list">
    <div class="operation-list">
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
        @click="() => router.push({ name: 'TaskAssign' })"
      >
        <el-icon style="margin-right: 10px"><Plus /></el-icon>创建任务
      </el-button>
    </div>

    <el-table :data="currentPageData" :header-cell-style="tableHeaderCellStyle">
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
          {{ scope.row.currentNumber }} /
          {{ scope.row.numberOfPeers }}
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
      v-if="selectedTask && selectedTask.modelID"
      :task="selectedTask"
    />
    <task-result-dialog
      v-if="selectedTaskModel && selectedTask"
      :task="selectedTask"
      :model-info="selectedTaskModel"
    />
  </div>
</template>

<script lang="ts" setup>
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
import { fetchTaskDetail, taskTrain, fetchModel } from '@/api/fLearning'
import { computed, ref, watchEffect, onBeforeMount, onBeforeUnmount } from 'vue'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import useGlobalStateStore from '@/store/modules/globalState'
import { tableHeaderCellStyle } from '@/utils/style'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { AliasCN } from '@/constants/alias'
import { LocalStorage, setLocal } from '@/utils/localStorage'
import { watchAsyncResult } from '@/utils/watchers'
import { errorCatcher } from '@/utils/handlers'

const props = defineProps<{
  tasks: FLearningAPI.TaskInfo[]
  isMytaskList: boolean
}>()

const globalStateStore = useGlobalStateStore()
const locale = zhCn // 汉化 pagination 组件

const stateFilterOptions = [
  { value: 'ASSIGNED', label: '待开始' },
  { value: 'TRAINED', label: '进行中' },
  { value: 'FINISHED', label: '已完成' },
]

const tableColumns = ['taskName', 'assignDateTime']
const searchContent = ref('') // 搜索关键词
const selectedState = ref('') // 选择查看的任务状态
onBeforeMount(() => {
  // 获取可能存在的筛选条件（eg: 从 dashboard 点击跳转）
  searchContent.value = globalStateStore.searchTaskName
  selectedState.value = globalStateStore.filterTaskState
})

const pageSize = ref(15) // 页条目数
const currentPage = ref(1) // 当前页数
const currentPageData = ref() // 当前页数据

const selectedTask = ref() // 选择的任务
const selectedTaskDetail = ref() // 选择的任务详情
const selectedTaskModel = ref() // 选择的任务模型

onBeforeUnmount(() => {
  // 组件卸载前清空筛选条件
  globalStateStore.searchTaskName = ''
  globalStateStore.filterTaskState = ''
})

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
      task.state.includes(selectedState.value)
  )
)

// 获取当前页数据
const getCurrentPageData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  currentPageData.value = filteredTasks.value.slice(
    startIndex,
    startIndex + pageSize.value
  )
}

watchEffect(() => {
  // 页号或页大小变动，重新获取页面数据
  if (currentPage.value || pageSize) {
    getCurrentPageData()
  }
})

// [Button]: 任务详情
const viewTaskDetail = async (task: FLearningAPI.TaskInfo) => {
  try {
    selectedTaskDetail.value = await fetchTaskDetail(task.modelID, task.partyID)
    globalStateStore.taskDetailDialogVisible = true
  } catch (err) {
    errorCatcher(err)
  }
}

// [Button]: 任务接收
const handleAccept = (task: FLearningAPI.TaskInfo) => {
  selectedTask.value = task
  globalStateStore.taskAcceptDialogVisible = true
}

// [Button]: 查看任务结果
const viewTaskResult = async (task: FLearningAPI.TaskInfo) => {
  selectedTask.value = task
  selectedTaskModel.value = await fetchModel(task.modelID)
  globalStateStore.taskResultDialogVisible = true
}

// [Button]: 任务开始
const handleTrain = async (task: FLearningAPI.TaskInfo) => {
  if (!task.currentNumber) {
    ElMessage.error('至少需要一位接收方参与')
    return
  }

  ElMessageBox.confirm(
    '模型训练过程中不可暂停，是否确认开始任务？',
    'Warning',
    {
      confirmButtonText: '确认，开始任务',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      /* TODO: 该参数目前固定 */
      const modelAndEvaluation =
        '{ "HomoSecureboost_0": { "task_type": "classification", "objective_param": { "objective": "cross_entropy" }, "num_trees": 3, "validation_freqs": 1, "tree_param": { "max_depth": 3 } }, "evaluation_0": { "eval_type": "binary" } }'

      try {
        const { queryURL } = await taskTrain({
          modelID: task.modelID,
          modelAndEvaluation,
        })
        ElMessage.info('任务已开始训练')
        const localName = LocalStorage.TrainResultCallback
        setLocal(localName, {
          taskName: task.taskName,
          callbackURL: queryURL,
        })
        watchAsyncResult(localName)
      } catch (err) {
        errorCatcher(err)
      }
    })
    .catch(() => {})
}
</script>

<script lang="ts">
export default {
  name: 'TaskList',
}
</script>

<style scoped lang="scss">
.operation-list {
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
