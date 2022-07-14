<template>
  <el-dialog
    v-model="globalStateStore.taskDetailDialogVisible"
    title="任务详情"
    width="50%"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="任务名称" align="center" :min-width="120">
        {{ props.taskDetail.taskName }}
      </el-descriptions-item>
      <el-descriptions-item label="创建人" align="center">
        {{ props.taskDetail.assigner.nickname }}
      </el-descriptions-item>
      <el-descriptions-item label="模型ID" align="center">
        {{ props.taskDetail.modelID }}
      </el-descriptions-item>
      <el-descriptions-item label="模型名称" align="center">
        {{ props.taskDetail.modelName }}
      </el-descriptions-item>
      <el-descriptions-item label="任务描述" align="center">
        {{ props.taskDetail.description }}
      </el-descriptions-item>
    </el-descriptions>
    <br />
    <h3>参与者</h3>
    <el-table
      :data="props.taskDetail.acceptors"
      border
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <el-table-column
        key="nickname"
        :label="AliasCN['nickname']"
        prop="nickname"
        align="center"
      >
        <!-- {{ scope.row.nickname }} -->
        <!-- <template #default="scope">
          <div class="user-info">
            <el-avatar :src="scope.row.avatarUrl" size="small" />
            <span class="user-nickname">{{ scope.row.nickname }}</span>
          </div>
        </template> -->
      </el-table-column>
      <el-table-column
        key="participateDateTime"
        align="center"
        :label="AliasCN['participateDateTime']"
        prop="participateDateTime"
      />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="globalStateStore.taskDetailDialogVisible = false"
        >
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useGlobalStateStore from '@/store/modules/globalState'
import { tableHeaderCellStyle, tableCellStyle } from '@/utils/style'
import { AliasCN } from '@/constants/alias'

const props = defineProps<{ taskDetail: FLearningAPI.TaskDetail }>()

const globalStateStore = useGlobalStateStore()
</script>

<script lang="ts">
export default {
  name: 'TaskDetailDialog',
}
</script>

<style scoped lang="scss">
.user-info {
  display: flex;
  align-items: center;

  .user-nickname {
    margin-left: 10px;
  }
}
</style>
