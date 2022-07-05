<template>
  <div class="additional-operations">
    <el-input v-model="search" class="search-bar" placeholder="按任务名搜索">
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>
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
    :header-cell-style="{
      height: '60px',
      color: '#111',
      backgroundColor: '#DEECFC',
    }"
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
          <el-icon style="margin-left: 5px"><DArrowRight /></el-icon>
        </el-button>
        <el-button
          v-if="showBtnStartTask(scope.row)"
          type="success"
          :disabled="scope.row.state !== 'ASSIGNED'"
          @click="handleTrain(scope.row)"
        >
          开始任务
        </el-button>
        <el-button
          v-else-if="props.isMytaskList"
          type="success"
          :disabled="scope.row.state !== 'FINISHED'"
          @click="viewTaskResult(scope.row)"
        >
          查看结果
        </el-button>
        <el-button
          v-if="!props.isMytaskList"
          link
          type="danger"
          @click="handleAccept(scope.row)"
        >
          接收任务
          <el-icon style="margin-left: 5px"><CirclePlus /></el-icon>
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

  <task-result-dialog
    v-if="selectedTaskModel"
    :model-info="selectedTaskModel"
  />
  <task-detail-dialog
    v-if="selectedTaskDetail"
    :task-detail="selectedTaskDetail"
  />
  <task-accept-dialog
    v-if="seletedTask && seletedTask.modelID"
    :model-id="seletedTask.modelID"
  />
</template>

<script lang="ts" setup>
import { modelInfoTest, AliasCN } from '@/constants'
import TaskDetailDialog from '@/components/fLearning/TaskDetailDialog.vue'
import TaskAcceptDialog from '@/components/fLearning/TaskAcceptDialog.vue'
import TaskResultDialog from '@/components/fLearning/TaskResult/TaskResultDialog.vue'
import { Search, Plus, DArrowRight, CirclePlus } from '@element-plus/icons-vue'
import { fetcTaskDetail, taskTrain, fetchModel } from '@/api/fLearning'
import { computed, ref, defineProps, watchEffect } from 'vue'
import router from '@/router'
import { ElMessage, ElNotification } from 'element-plus'
import useLayoutStore from '@/store/modules/layout'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // locale

const props = defineProps<{
  tasks: FLearningAPI.TaskInfo[]
  isMytaskList: boolean
}>()

const layoutStore = useLayoutStore()
const locale = zhCn // 汉化 pagination 组件

const tableColumns = ['taskName', 'assignDateTime', 'timeLimit']
const search = ref('') // 搜索关键词
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
    (data) =>
      !search.value ||
      data.taskName.toLowerCase().includes(search.value.toLowerCase()),
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
  selectedTaskModel.value = modelInfoTest
  layoutStore.taskResultDialogVisible = true
}

// [Button]: 任务开始
const handleTrain = async (task: FLearningAPI.TaskInfo) => {
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
}

// 页号或页大小变动，重新获取页面数据
watchEffect(() => {
  if (currentPage.value || pageSize) {
    getCurrentPageData()
  }
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
    height: 35px;
  }

  .task-assign-btn {
    font-size: 16px;
    padding: 18px 36px;
  }
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
