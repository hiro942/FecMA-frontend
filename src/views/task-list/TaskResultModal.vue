<template>
  <n-modal
    v-if="globalStateStoreStore.taskResultModalVisible"
    v-model:show="globalStateStoreStore.taskResultModalVisible"
    preset="dialog"
    :auto-focus="false"
    title="模型性能结果"
    type="success"
    style="width: 95vw; height: 95vh; overflow: scroll"
  >
    <!--    <template v-if="task.modelName === 'homo_secureboost'">
          <n-divider />
          <n-descriptions
            label-placement="left"
            :column="1"
            bordered
            label-style="width: 130px"
            size="small"
          >
            <n-descriptions-item label="任务类型">
              <template #default>
                <n-descriptions-item label="任务类型">
                  {{ metricData.meta.meta_data.taskType }}
                </n-descriptions-item>
                <n-descriptions-item label="任务类型">
                  {{ metricData.meta.meta_data.taskType }}
                </n-descriptions-item>
              </template>
            </n-descriptions-item>
            <n-descriptions-item
              v-if="metricData.meta.meta_data.taskType === 'classification'"
              label="类别"
            >
              {{ metricData.data.classes }}
            </n-descriptions-item>
            <n-descriptions-item label="train">
              <div v-for="item in metricDataAll.eval.train.homo_secureboost_0.data">
                {{ item }}
              </div>
            </n-descriptions-item>
            <n-descriptions-item
              v-if="metricDataAll.eval.validate"
              label="validate"
            >
              <div
                v-for="item in metricDataAll.eval.validate.homo_secureboost_0.data"
              >
                {{ item }}
              </div>
            </n-descriptions-item>
          </n-descriptions>

          <n-divider v-if="metricData.meta.meta_data.taskType === 'classification'">
            模型指标
          </n-divider>

          <n-tabs
            v-if="metricData.meta.meta_data.taskType === 'classification'"
            type="line"
            animated
          >
            <n-tab-pane name="ks" tab="KS">
              <n-tabs type="segment" animated>
                <n-tab-pane
                  v-for="type in metricDataAll.eval.validate
                    ? ['train', 'validate']
                    : ['train']"
                  :name="type"
                  :tab="type"
                >
                  <StackedLineChart
                    :chart-id="`ks-${type}`"
                    y-axis-name="tpr/fpr"
                    :chart-data="chartData(type)"
                    :adjoint-data="adjointData(type)"
                  />
                </n-tab-pane>
              </n-tabs>
            </n-tab-pane>

            <n-tab-pane
              v-for="metricName in ['accuracy', 'lift', 'roc', 'gain']"
              :name="metricName"
              :tab="metricName.slice(0, 1).toUpperCase() + metricName.slice(1)"
            >
              <n-tabs type="segment" animated>
                <n-tab-pane
                  v-for="type in metricDataAll.eval.validate
                    ? ['train', 'validate']
                    : ['train']"
                  :name="type"
                  :tab="type"
                >
                  <LineChart
                    :chart-id="`${metricName}-${type}`"
                    :y-axis-name="metricName"
                    :chart-data="
                      metricDataAll.eval[type]['homo_secureboost_0_' + metricName]
                        .data
                    "
                    :adjoint-data="[
                      {
                        name: 'threshold',
                        data: metricDataAll.eval[type][
                          'homo_secureboost_0_' + metricName
                        ].meta.thresholds,
                      },
                    ]"
                  />
                </n-tab-pane>
              </n-tabs>
            </n-tab-pane>

            <n-tab-pane name="precision-recall" tab="Precision-Recall">
              <n-tabs type="segment" animated>
                <n-tab-pane
                  v-for="type in metricDataAll.eval.validate
                    ? ['train', 'validate']
                    : ['train']"
                  :name="type"
                  :tab="type"
                >
                  <LineChart
                    :chart-id="`precision-recall-${type}`"
                    x-axis-name="recall"
                    y-axis-name="precision"
                    :chart-data="getPrecisionRecallCurveData(type)"
                    :adjoint-data="[
                      {
                        name: 'threshold',
                        data: metricDataAll.eval[type].homo_secureboost_0_precision
                          .meta.thresholds,
                      },
                    ]"
                  />
                </n-tab-pane>
              </n-tabs>
            </n-tab-pane>
          </n-tabs>
        </template>-->

    <template v-if="taskType !== 'unknown'">
      <template v-if="metricData?.data?.lossHistory?.length">
        <n-divider> 训练过程</n-divider>
        <LineChart
          chart-id="loss"
          x-axis-name="iteration"
          y-axis-name="loss"
          :chart-data="metricData.data.lossHistory"
        />
      </template>

      <n-divider> 模型指标</n-divider>
      <n-tabs type="line" animated>
        <n-tab-pane name="es" tab="Evaluation Summary">
          <n-tabs type="segment" animated>
            <n-tab-pane
              v-for="type in metricDataAll.eval.validate
                ? ['train', 'validate']
                : ['train']"
              :name="type"
              :tab="type"
            >
              <n-descriptions
                class="h-[500px] pt-[20px]"
                label-placement="left"
                :column="1"
                bordered
                label-style="width: 230px"
              >
                <n-descriptions-item
                  v-for="item in metricDataAll.eval[type][task.modelName + '_0']
                    ?.data"
                  :label="item?.[0]"
                >
                  {{ item?.[1] }}
                </n-descriptions-item>
              </n-descriptions>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane v-if="taskType === 'binary'" name="ks" tab="KS">
          <n-tabs type="segment" animated>
            <n-tab-pane
              v-for="type in metricDataAll.eval.validate
                ? ['train', 'validate']
                : ['train']"
              :name="type"
              :tab="type"
            >
              <StackedLineChart
                :chart-id="`ks-${type}`"
                y-axis-name="tpr/fpr"
                :chart-data="stackLineChartData4KS(type)"
                :adjoint-data="stackLineChartAdjointData4KS(type)"
              />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane
          v-if="taskType === 'binary'"
          v-for="metricName in ['accuracy', 'lift', 'roc', 'gain']"
          :name="metricName"
          :tab="metricName.slice(0, 1).toUpperCase() + metricName.slice(1)"
        >
          <n-tabs type="segment" animated>
            <n-tab-pane
              v-for="type in metricDataAll.eval.validate
                ? ['train', 'validate']
                : ['train']"
              :name="type"
              :tab="type"
            >
              <LineChart
                :chart-id="`${metricName}-${type}`"
                :y-axis-name="metricName"
                :chart-data="
                  metricDataAll.eval[type][task.modelName + '_0_' + metricName]
                    .data
                "
                :adjoint-data="[
                  {
                    name: 'threshold',
                    data: metricDataAll.eval[type][
                      task.modelName + '_0_' + metricName
                    ].meta.thresholds,
                  },
                ]"
              />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane
          v-if="taskType === 'binary'"
          name="precision-recall"
          tab="Precision-Recall"
        >
          <n-tabs type="segment" animated>
            <n-tab-pane
              v-for="type in metricDataAll.eval.validate
                ? ['train', 'validate']
                : ['train']"
              :name="type"
              :tab="type"
            >
              <LineChart
                :chart-id="`precision-recall-${type}`"
                x-axis-name="recall"
                y-axis-name="precision"
                :chart-data="getPrecisionRecallCurveData(type)"
                :adjoint-data="[
                  {
                    name: 'threshold',
                    data: metricDataAll.eval[type][
                      task.modelName + '_0_precision'
                    ].meta.thresholds,
                  },
                ]"
              />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>

        <n-tab-pane
          v-if="taskType === 'multi'"
          name="precision-recall"
          tab="Precision-Recall"
        >
          <n-tabs type="segment" animated>
            <n-tab-pane
              v-for="type in metricDataAll.eval.validate
                ? ['train', 'validate']
                : ['train']"
              :name="type"
              :tab="type"
            >
              <StackedLineChart
                :chart-id="`precision-recall-${type}`"
                x-axis-name="class"
                y-axis-name="precision-recall"
                :chart-data="stackLineChartData4PrecisionRecall(type)"
              />
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
      </n-tabs>
    </template>
    <template v-else> oops! nothing to show! :(</template>
  </n-modal>
</template>

<script setup lang="ts">
import LineChart from '@/components/charts/LineChart.vue'
import StackedLineChart from '@/components/charts/StackedLineChart.vue'
import useGlobalStateStore from '@/store/globalState'
import { useMessage } from 'naive-ui'

const props = defineProps<{
  task: FLearningModels.Task
  metricData: any
  metricDataAll: any
}>()

const taskType = computed(() => {
  if (Object.keys(props.metricDataAll?.eval).length === 0) {
    return 'unknown'
  }
  if (props.metricDataAll.eval.train[props.task.modelName + '_0_lift']) {
    return 'binary'
  }
  if (props.metricDataAll.eval.train[props.task.modelName + '_0_precision']) {
    return 'multi'
  }
})
console.log('%%% task', props.task)
console.log('### metricData', props.metricData)
console.log('@@@ metricDataAll', props.metricDataAll)

const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()

const stackLineChartData4PrecisionRecall = (type: 'train' | 'validate') => {
  const { modelName } = props.task
  let pName = modelName + '_0_precision'
  let rName = modelName + '_0_recall'
  return [
    {
      name: 'precision',
      data: props.metricDataAll.eval[type][pName].data,
    },
    {
      name: 'recall',
      data: props.metricDataAll.eval[type][rName].data,
    },
  ]
}

const stackLineChartData4KS = (type: 'train' | 'validate') => {
  const { modelName } = props.task
  let ksTprName = modelName + '_0_ks_tpr'
  let ksFprName = modelName + '_0_ks_fpr'
  return [
    {
      name: 'tpr',
      data: props.metricDataAll.eval[type][ksTprName].data,
    },
    {
      name: 'fpr',
      data: props.metricDataAll.eval[type][ksFprName].data,
    },
  ]
}

const stackLineChartAdjointData4KS = (type: 'train' | 'validate') => {
  const { modelName } = props.task
  let ksTprName = modelName + '_0_ks_tpr'
  let ksFprName = modelName + '_0_ks_fpr'
  return [
    {
      name: 'threshold',
      data: props.metricDataAll.eval[type][ksTprName].meta.thresholds,
    },
    {
      name: 'ks',
      data: props.metricDataAll.eval[type][ksTprName].data.map(
        (item: any, index: number) =>
          (
            item[1] - props.metricDataAll.eval[type][ksFprName].data[index][1]
          ).toFixed(6)
      ),
    },
  ]
}

const getPrecisionRecallCurveData = (type: 'train' | 'validate') => {
  const { modelName } = props.task
  let precisionName = modelName + '_0_precision'
  let recallName = modelName + '_0_recall'
  const result = []
  const len = props.metricDataAll.eval[type][precisionName].data.length
  for (let i = 0; i < len; i += 1) {
    result.push([
      props.metricDataAll.eval[type][recallName].data[i][1],
      props.metricDataAll.eval[type][precisionName].data[i][1],
    ])
  }
  return result
}
</script>