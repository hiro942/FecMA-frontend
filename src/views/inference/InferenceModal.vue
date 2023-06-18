<template>
  <n-modal
    v-if="inferenceHistoryList"
    v-model:show="globalStateStoreStore.inferenceModalVisible"
    preset="card"
    title="模型推理"
    style="height: 95vh; width: 95vw; overflow: scroll"
  >
    <n-descriptions
      label-placement="left"
      :column="1"
      bordered
      label-style="width: 130px"
    >
      <n-descriptions-item :label="AliasCN.taskName">
        {{ task.taskName }}
      </n-descriptions-item>
      <n-descriptions-item :label="AliasCN.modelID">
        {{ task.modelID }}
      </n-descriptions-item>
    </n-descriptions>

    <n-divider />

    <n-space justify="space-between">
      <n-h4>推理结果</n-h4>
      <n-upload
        v-if="showUploadButton"
        ref="upload"
        :show-file-list="false"
        style="float: right"
        @update:file-list="onInferenceFileChange"
      >
        <n-button secondary type="error"> 选择文件并开始推理</n-button>
      </n-upload>
    </n-space>
    <n-alert type="warning" class="my-5">
      推理时请根据任务性质上传不带标签的原始数据（CSV文件或ZIP压缩文件）。
    </n-alert>

    <!--    <n-data-table-->
    <!--      size="small"-->
    <!--      :columns="models.length ? modelTableColumns : []"-->
    <!--      :data="models"-->
    <!--      :pagination="models.length > 5 ? { pageSize: 5 } : undefined"-->
    <!--    >-->
    <!--      <template #empty> 暂无推理结果</template>-->
    <!--    </n-data-table>-->

    <!--    <n-card class="min-h-[200px]">-->
    <!--      <n-space justify="center" align="center">-->
    <!--        &lt;!&ndash;        <div>&ndash;&gt;-->
    <!--        &lt;!&ndash;          预测 IPv6 地址空间：&ndash;&gt;-->
    <!--        &lt;!&ndash;          <n-code>&ndash;&gt;-->
    <!--        &lt;!&ndash;            {{ &ndash;&gt;-- >
  < !-- &lt; ! & ndash;              inferenceHistoryList[ & ndash;&gt;-- >
  < !-- &lt; ! & ndash;                inferenceHistoryList.length - 1 & ndash;&gt;-- >
  < !-- &lt; ! & ndash;              ].result.content & ndash;&gt;-- >
  < !-- &lt; ! & ndash;                .slice(15, -2) & ndash;&gt;-- >
  < !-- &lt; ! & ndash;                .toUpperCase() + ':****' & ndash;&gt;-- >
  < !-- &lt; ! & ndash; }}&ndash;&gt;-->
    <!--        &lt;!&ndash;          </n-code>&ndash;&gt;-->
    <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--        &lt;!&ndash;        &lt;!&ndash;        <div>**** 代表后四位地址随意组合</div>&ndash;&gt;&ndash;&gt;-->
    <!--      </n-space>-->
    <!--    </n-card>-->

    <n-card>
      <!--    栅格布局，左边是导航，右边是内容-->
      <n-grid
        v-if="inferenceHistoryList?.length"
        class="overflow-hidden"
        x-gap="0"
        y-gap="24"
        cols="4"
      >
        <!--        left: nav-bar-->
        <n-gi
          span="1"
          class="history-nav max-h-[500px] border-b-gray-100 border-b-2 pb-1.5"
        >
          <n-scrollbar style="max-height: 500px">
            <div
              v-for="history in inferenceHistoryList"
              :key="history.inferenceDateTime"
              class="hover:cursor-pointer rounded padding: p-[12px]"
              :class="[
                history === selectedHistory ? 'bg-gray-200' : '',
                history.state === 2 ? 'text-red-400' : '',
                history.state === 1 ? 'text-green-600' : '',
              ]"
              @click="onSelectHistory(history)"
            >
              <div>{{ history.inferenceFile.fileName }}</div>
              <div style="color: darkgray; font-size: small">
                {{
                  dayjs(history.inferenceDateTime).format('YYYY-MM-DD HH:mm')
                }}
              </div>
            </div>
          </n-scrollbar>
        </n-gi>

        <!--        right: inference content-->
        <n-gi span="3" class="p-[20px]" v-if="selectedHistory?.state === 1">
          <n-space justify="start" align="center" class="mb-3">
            <n-button
              secondary
              type="info"
              @click="downloadInferenceFile"
              class="mr-5"
            >
              下载推理数据集文件
            </n-button>
            <n-button secondary type="info" @click="downloadInferenceResult">
              下载推理结果文件
            </n-button>
          </n-space>
          <n-data-table
            :columns="tableColumns"
            :data="tableData"
            striped
            :max-height="400"
          />
        </n-gi>
        <n-gi
          span="3"
          class="p-[20px] mx-auto"
          v-if="selectedHistory?.state === 2"
        >
          推理出错
        </n-gi>
      </n-grid>
      <n-empty v-else description="暂无推理历史" />
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import useGlobalStateStore from '@/store/globalState'
import type { UploadFileInfo } from 'naive-ui'
import { NButton, useDialog, useMessage, useNotification } from 'naive-ui'
import { modelInference, modelInferenceIPv6 } from '@/api/fLearning'
import { AliasCN } from '@/configs/maps'
import dayjs from 'dayjs'
import request from '@/plugins/request'
import { download } from '@/utils/download'

const dialog = useDialog()
const notification = useNotification()
const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()
const props = defineProps<{
  taskType: 'ipv6' | 'normal'
  task: FLearningModels.Task
  inferenceHistoryList: FLearningModels.InferenceHistory[]
}>()

const showUploadButton = ref(true)
const selectedHistory = ref<FLearningModels.InferenceHistory>()

onBeforeMount(async () => {
  if (props.inferenceHistoryList?.length) {
    selectedHistory.value = props.inferenceHistoryList[0]
  }
})

const onSelectHistory = (history: FLearningModels.InferenceHistory) =>
  (selectedHistory.value = history)

let inferenceFile: any

const onInferenceFileChange = (fileList: UploadFileInfo[]) => {
  inferenceFile = fileList[0].file
  dialog.success({
    title: '确认操作',
    content: '点击确定后将上传文件进行推理，是否确认此次操作？',
    positiveText: '确定',
    negativeText: '不确定',
    onMaskClick: () => {
      message.info('已取消')
    },
    onNegativeClick: () => {
      message.info('已取消')
    },
    onPositiveClick: () => {
      notification.success({
        title: '推理下发成功',
        content: '稍后可通过该页面查看结果',
        duration: 5000,
      })
      console.log('上传文件', inferenceFile)
      if (props.taskType === 'normal') {
        modelInference({
          modelID: props.task.modelID,
          inferenceFile,
        })
      } else if (props.taskType === 'ipv6') {
        modelInferenceIPv6({ modelID: props.task.modelID, inferenceFile })
      }
      showUploadButton.value = false
      setTimeout(() => {
        showUploadButton.value = true
      }, 100)
    },
  })
}

const tableColumns = ref<any>([])
const tableData = ref<any>([])

watch(selectedHistory, () => {
  if (selectedHistory.value?.state === 2) {
    return
  }
  // TODO 可能是array 也可能是string
  if (typeof tableData.value === 'object') {
    tableData.value = selectedHistory.value?.result.content
  }
  if (typeof tableData.value === 'string') {
    tableData.value = JSON.parse(
      selectedHistory.value?.result.content as string
    )
  }
  tableColumns.value = Object.keys(tableData.value[0])
    .map((item) => {
      let title = item
      if (item === 'label') {
        title = '预测标签'
      } else if (item === 'score' || item === '预测分数') {
        // TODO 分数就不展示了
        return null
      } else if (item === 'filename') {
        title = '图片文件名'
      }
      return {
        align: 'center',
        title,
        key: item,
      }
    })
    .filter((item) => item != null)

  // 如果filename在第一或第二列，就把它放最后一列去
  if (tableColumns.value?.[0].key === 'filename') {
    tableColumns.value = tableColumns.value
      .slice(1)
      .concat(tableColumns.value.slice(0, 1))
  } else if (tableColumns.value?.[1].key === 'filename') {
    tableColumns.value = tableColumns.value
      .slice(0, 1)
      .concat(tableColumns.value.slice(2))
      .concat(tableColumns.value.slice(1, 2))
  }
})

const downloadInferenceFile = async () => {
  const rawUrl = selectedHistory.value?.inferenceFile.url as string
  const url = rawUrl.slice(rawUrl.indexOf('api') + 3)

  request({
    url: url,
    method: 'GET',
  }).then((res) => download(res, '推理数据集.csv'))
}

const downloadInferenceResult = async () => {
  const rawUrl = selectedHistory.value?.result.url as string
  const inferenceFileName = selectedHistory.value?.inferenceFile.fileName
  const url =
    rawUrl.slice(rawUrl.indexOf('api') + 3) +
    `&inferenceFileName=${inferenceFileName}`

  request({
    url: url,
    method: 'GET',
  }).then((res) => download(res, '推理结果.csv'))
}
</script>