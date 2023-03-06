<template>
  <div v-if='metricData'>
    <!--    <LineChart-->
    <!--      chart-id="loss"-->
    <!--      chart-name="训练损失变化"-->
    <!--      x-axis-name="iteration"-->
    <!--      y-axis-name="loss"-->
    <!--      :chart-data="metricData.train.train.loss.data"-->
    <!--    />-->

    <!--    <n-tabs type="line" animated>-->
    <!--      <n-tab-pane name="acc" tab="Accuracy">-->
    <!--        <LineChart-->
    <!--          chart-id="acc"-->
    <!--          y-axis-name="accuracy"-->
    <!--          :chart-data="metricData.eval.train.homolr_0_accuracy.data"-->
    <!--          :adjoint-data="[-->
    <!--            {-->
    <!--              name: 'threshold',-->
    <!--              data: metricData.eval.train.homolr_0_accuracy.meta.thresholds,-->
    <!--            },-->
    <!--          ]"-->
    <!--        />-->
    <!--      </n-tab-pane>-->
    <!--      <n-tab-pane name="ks" tab="KS">-->
    <!--        <StackedLineChart-->
    <!--          chart-id="ks"-->
    <!--          y-axis-name="tpr/fpr"-->
    <!--          :chart-data="chartData"-->
    <!--          :adjoint-data="adjointData"-->
    <!--        />-->
    <!--      </n-tab-pane>-->
    <!--      <n-tab-pane name="roc" tab="ROC">-->
    <!--        <LineChart-->
    <!--          chart-id="roc"-->
    <!--          x-axis-name="fpr"-->
    <!--          y-axis-name="tpr"-->
    <!--          :chart-data="metricData.eval.train.homolr_0_roc.data"-->
    <!--          :adjoint-data="[-->
    <!--            {-->
    <!--              name: 'threshold',-->
    <!--              data: metricData.eval.train.homolr_0_roc.meta.thresholds,-->
    <!--            },-->
    <!--          ]"-->
    <!--        />-->
    <!--      </n-tab-pane>-->
    <!--      <n-tab-pane name="lift" tab="Lift">-->
    <!--        <LineChart-->
    <!--          chart-id="lift"-->
    <!--          y-axis-name="lift"-->
    <!--          :chart-data="metricData.eval.train.homolr_0_lift.data"-->
    <!--          :adjoint-data="[-->
    <!--            {-->
    <!--              name: 'threshold',-->
    <!--              data: metricData.eval.train.homolr_0_lift.meta.thresholds,-->
    <!--            },-->
    <!--          ]"-->
    <!--        />-->
    <!--      </n-tab-pane>-->
    <!--      <n-tab-pane name="precision-recall" tab="Precision-Recall">-->
    <!--        <LineChart-->
    <!--          chart-id="precision-recall"-->
    <!--          x-axis-name="recall"-->
    <!--          y-axis-name="precision"-->
    <!--          :chart-data="getPrecisionRecallCurveData()"-->
    <!--          :adjoint-data="[-->
    <!--            {-->
    <!--              name: 'threshold',-->
    <!--              data: metricData.eval.train.homolr_0_precision.meta.thresholds,-->
    <!--            },-->
    <!--          ]"-->
    <!--        />-->
    <!--      </n-tab-pane>-->

    <!--      <n-tab-pane name="gain" tab="Gain">-->
    <!--        <LineChart-->
    <!--          chart-id="gain"-->
    <!--          y-axis-name="gain"-->
    <!--          :chart-data="metricData.eval.train.homolr_0_gain.data"-->
    <!--          :adjoint-data="[-->
    <!--            {-->
    <!--              name: 'threshold',-->
    <!--              data: metricData.eval.train.homolr_0_gain.meta.thresholds,-->
    <!--            },-->
    <!--          ]"-->
    <!--        />-->
    <!--      </n-tab-pane>-->
    <!--    </n-tabs>-->
  </div>
</template>

<script setup lang='ts'>
import { onBeforeMount, ref } from 'vue'
import { fetchTaskResult } from '@/api/fLearning'
import { useMessage } from 'naive-ui'

const props = defineProps<{ task: FLearningModels.Task }>()

const message = useMessage()
const metricData = ref()
onBeforeMount(async () => {
  try {
    metricData.value = await fetchTaskResult(props.task.modelID)
  } catch (err: any) {
    message.error(err.message)
  }
})

const chartData = [
  {
    name: 'tpr',
    data: metricData.value.eval.train.homolr_0_ks_tpr.data
  },
  {
    name: 'fpr',
    data: metricData.value.eval.train.homolr_0_ks_fpr.data
  }
]


const adjointData = [
  {
    name: 'threshold',
    data: metricData.value.eval.train.homolr_0_ks_tpr.meta.thresholds
  },
  {
    name: 'ks',
    data: metricData.value.eval.train.homolr_0_ks_tpr.data.map(
      (item: any, index: number) =>
        (
          item[1] - metricData.value.eval.train.homolr_0_ks_fpr.data[index][1]
        ).toFixed(6)
    )
  }
]

const getPrecisionRecallCurveData = () => {
  const result = []
  const len = metricData.value.eval.train.homolr_0_precision.data.length
  for (let i = 0; i < len; i += 1) {
    result.push([
      metricData.value.eval.train.homolr_0_recall.data[i][1],
      metricData.value.eval.train.homolr_0_precision.data[i][1]
    ])
  }
  return result
}
</script>
