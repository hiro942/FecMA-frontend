<template>
  <n-modal
    v-model:show="globalStateStore.inferenceModalVisible"
    preset="card"
    title="模型推理"
    style="height: 100vh; padding: 30px; margin: auto"
  >
    <!--    <template #header-extra>-->
    <!--      <n-button text style="margin-right: 30px">查看内阁</n-button>-->
    <!--    </template>-->

    <n-space vertical align="center">
      <UploadDragger
        style="width: 400px"
        filename="待推理数据文件"
        :on-file-change="onInferenceFileChange"
      />

      <n-button @click="fetchInferenceResult">开始推理</n-button>
    </n-space>

    <n-divider />

    <n-space justify="space-between">
      <h4>推理结果</h4>
      <n-button
        type="info"
        secondary
        size="small"
        @click="downloadInferenceResult"
      >
        下载推理结果
      </n-button>
    </n-space>

    <n-data-table
      :columns="tableColumns"
      :data="data"
      :pagination="{ pageSize: 15 }"
      :bordered="false"
    />
  </n-modal>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import useGlobalStateStore from '@/store/modules/globalState'
import UploadDragger from '@/components/upload/UploadDragger.vue'
import {
  DataTableColumns,
  NButton,
  NGradientText,
  UploadFileInfo,
  useMessage,
} from 'naive-ui'
import { AliasCN } from '@/constants/alias'
import { fetchTransaction } from '@/api/blockchain'
import { downloadModel, fetchInferenceResult } from '@/api/fLearning'
import { download } from '@/utils/download'

const message = useMessage()
const globalStateStore = useGlobalStateStore()

const onInferenceFileChange = (fileList: UploadFileInfo[]) => {
  console.log('[调用] onInferenceFileChange')
}

const tableColumns: DataTableColumns<any> = [
  {
    title: 'x1',
    key: 'x1',
    align: 'center',
  },
  {
    title: 'x2',
    key: 'x2',
    align: 'center',
  },
  {
    title: 'x3',
    key: 'x3',
    align: 'center',
  },
  {
    title() {
      return h(
        NGradientText,
        {
          type: 'success',
        },
        { default: () => '推理结果' }
      )
    },
    key: 'y',
    align: 'center',
  },
]

const data = [
  {
    y: '5.953191',
    x1: '1.12331',
    x2: '9.32141',
    x3: '5.21316',
  },
  {
    y: '5.953191',
    x1: '1.12331',
    x2: '9.32141',
    x3: '5.21316',
  },
  {
    y: '5.953191',
    x1: '1.12331',
    x2: '9.32141',
    x3: '5.21316',
  },
  {
    y: '5.953191',
    x1: '1.12331',
    x2: '9.32141',
    x3: '5.21316',
  },
]

const handleInferenceResult = async () => {
  // TODO: 待完善
  await fetchInferenceResult()
}

const downloadInferenceResult = async () => {
  try {
    const inferenceResult = await downloadInferenceResult()
    message.success('操作成功，下载即将开始')
    download(inferenceResult, '推理结果.json')
  } catch (err: any) {
    message.error(err.message)
  }
}
</script>
