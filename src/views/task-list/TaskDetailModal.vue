<template>
  <n-modal
    v-if="taskDetail"
    v-model:show="globalStateStore.taskDetailModalVisible"
    preset="card"
    :auto-focus="false"
    title="任务详情"
    style="width: 95vw; height: 95vh; overflow: scroll"
  >
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 130px"
      size="small"
    >
      <n-descriptions-item :label="AliasCN.taskName">
        {{ taskDetail.taskName }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.modelID">
        {{ taskDetail.modelID }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.modelName">
        {{ modelNamesMapCN[taskDetail.modelName] }}
      </n-descriptions-item>
      <n-descriptions-item label="创建人">
        {{ taskDetail.assigner.nickname }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.assignDateTime">
        {{ dayjs(taskDetail.assignDateTime).format('YYYY-MM-DD HH:mm') }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.timeLimit">
        {{
          dayjs(taskDetail.assignDateTime)
            .add(taskDetail.timeLimit, 'second')
            .format('YYYY-MM-DD HH:mm')
        }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.description">
        {{ taskDetail.description }}
      </n-descriptions-item>
    </n-descriptions>

    <n-h4>任务数据特征</n-h4>

    <!--  根据「uploadPictureParam」参数的键值对数量是否为零判断是csv还是图片数据 -->
    <!--    图片任务-->
    <template v-if="Object.keys(taskDetail.uploadPictureParam).length">
      <n-card>
        <n-form-item
          label="图像裁剪大小"
          required
          label-placement="left"
          class="mt-[20px]"
        >
          <n-input-number
            class="w-[100px]"
            :default-value="taskDetail.uploadPictureParam.processSize.width"
            :show-button="false"
            :min="1"
            readonly
          >
            <template #suffix> px</template>
          </n-input-number>
          <span>&nbsp; ✖ &nbsp;️</span>
          <n-input-number
            v-model:value="taskDetail.uploadPictureParam.processSize.height"
            :show-button="false"
            :min="1"
            style="width: 100px"
            readonly
          >
            <template #suffix> px</template>
          </n-input-number>
        </n-form-item>
        <n-form-item
          label="图像裁剪方式"
          required
          label-placement="left"
          style="margin-top: 20px"
        >
          <n-input
            readonly
            :default-value="
              modelSettingsMap[taskDetail.uploadPictureParam.interpolation]
            "
          />
        </n-form-item>
      </n-card>
    </template>

    <!--    csv任务-->
    <template v-else>
      <n-data-table
        :columns="featuresTableColumns"
        :data="taskDetail.featureNames"
        :max-height="110"
        size="small"
      />
    </template>

    <n-h4>现有参与方</n-h4>
    <n-data-table
      :columns="acceptorsTableColumns"
      :data="taskDetail.acceptors"
      :max-height="200"
      size="small"
    >
      <template #empty> 暂无参与方</template>
    </n-data-table>
  </n-modal>
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { useMessage } from 'naive-ui'
import useGlobalStateStore from '@/store/globalState'
import { AliasCN, modelNamesMapCN, modelSettingsMap } from '@/configs/maps'
import dayjs from 'dayjs'

const globalStateStore = useGlobalStateStore()
const message = useMessage()
const props = defineProps<{ taskDetail: FLearningModels.TaskDetail }>()

// assigner 也算 acceptor 奥
props.taskDetail.acceptors.unshift(props.taskDetail.assigner)

type DataFeature = {
  name: string
  description: string
}

const featuresTableColumns: DataTableColumns<DataFeature> = [
  {
    title: '特征名',
    key: 'name',
    align: 'center',
    width: '30%',
  },
  {
    title: '特征描述',
    key: 'description',
    align: 'center',
    render: (row) => row.description || '-',
  },
]

type Acceptor = {
  nickname: string
  participateDateTime: string
}

const acceptorsTableColumns: DataTableColumns<Acceptor> = [
  {
    title: AliasCN.nickname,
    key: 'nickname',
    align: 'center',
  },
  {
    title: AliasCN.participateDateTime,
    key: 'participateDateTime',
    align: 'center',
    render: (row: Acceptor) =>
      dayjs(row.participateDateTime).format('YYYY-MM-DD HH:mm'),
  },
]
</script>