<template>
  <n-card>
    <n-grid :cols="4" :x-gap="24">
      <n-gi
        :span="1"
        class="rounded-lg border-2 text-center"
        v-for="(state, index) in taskState"
        :key="index"
        :style="{ borderColor: state.color }"
      >
        <n-icon
          class="mt-2"
          :color="state.color"
          size="32px"
          :component="state?.icon"
        />
        <div class="font-bold text-[32px]">
          <n-number-animation
            ref="numberAnimationInstRef"
            :from="0"
            :to="state.count"
          />
        </div>
        <div class="card-state">{{ AliasCN[state.name].text }}</div>
        <div
          class="flex justify-center items-center mt-3 cursor-pointer"
          :style="{ backgroundColor: state.color }"
          @click="viewTasksByState(state.name)"
        >
          <span class="mr-1">查看详情</span>
          <n-icon><ArrowRedoOutline /></n-icon>
        </div>
      </n-gi>
    </n-grid>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import {
  AlarmOutline,
  StopwatchOutline,
  AppsOutline,
  LayersOutline,
  ArrowRedoOutline,
} from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import useGlobalStateStore from '@/store/globalState'
import { NumberAnimationInst } from 'naive-ui'
import { AliasCN } from '@/configs/maps'

// 卡片数字动画效果
const numberAnimationInstRef = ref<NumberAnimationInst[] | null>(null)
onMounted(() => {
  numberAnimationInstRef.value?.[0].play()
})

const props = defineProps<{ myTasks: FLearningModels.Task[] }>()

const router = useRouter()
const globalStateStoreStore = useGlobalStateStore() // [store] 任务列表状态仓库

const taskState = computed(() => {
  let assigned = 0
  let trained = 0
  let finished = 0
  props.myTasks.forEach((task: FLearningModels.Task) => {
    if (task.state === 'ASSIGNED') {
      assigned += 1
    } else if (task.state === 'TRAINED') {
      trained += 1
    } else if (task.state === 'FINISHED') {
      finished += 1
    }
  })

  return [
    {
      name: 'ALL',
      count: props.myTasks.length,
      color: 'rgb(165, 219, 203)',
      icon: AppsOutline,
    },
    {
      name: 'ASSIGNED',
      count: assigned,
      color: 'rgb(243, 225, 171)',
      icon: StopwatchOutline,
    },
    {
      name: 'TRAINED',
      count: trained,
      color: 'rgb(166, 219, 243)',
      icon: AlarmOutline,
    },
    {
      name: 'FINISHED',
      count: finished,
      color: 'rgb(235, 188, 188)',
      icon: LayersOutline,
    },
  ]
})

// [Cards] 查看特定状态的任务
const viewTasksByState = (stateName: string) => {
  if (stateName !== 'ALL') {
    globalStateStoreStore.filterTaskState = stateName
  }
  router.push({ name: 'MyTask' })
}
</script>
