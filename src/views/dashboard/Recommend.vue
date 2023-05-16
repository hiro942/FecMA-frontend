<template>
  <n-card>
    <n-space justify="space-between" align="center">
      <n-h3>可参与任务</n-h3>
      <n-button class="float-right" @click="changeTaskBatch"> 换一批</n-button>
    </n-space>

    <n-input-group class="mb-5 mt-2.5">
      <n-input v-model:value="searchContent" placeholder="按任务名搜索" />
      <n-button @click="searchTask">
        <template #icon>
          <n-icon>
            <Search />
          </n-icon>
        </template>
      </n-button>
    </n-input-group>

    <n-grid v-if="allTasks?.length" cols="3" :y-gap="24" :x-gap="24">
      <n-gi
        v-for="(task, index) in recommendTasks"
        :key="index"
        class="recommend-item"
        @click="viewRecommendTask(task.taskName)"
      >
        <n-card class="hover:cursor-pointer" hoverable embedded>
          <template #header>
            <n-ellipsis class="max-w-full">
              {{ task.taskName }}
            </n-ellipsis>
          </template>
          <div class="flex items-center">
            <n-icon>
              <PersonAddOutline />
            </n-icon>
            <span class="ml-1">当前参与：{{ task.currentPeers }}</span>
          </div>
          <!--          <div class="flex items-center">-->
          <!--            <n-icon>-->
          <!--              <PeopleOutline />-->
          <!--            </n-icon>-->
          <!--            <span class="ml-1">最少参与：{{ task.minPeers }}</span>-->
          <!--          </div>-->
          <template #footer>
            <span class="text-[5px]">
              <n-ellipsis class="max-w-full">
                {{ dayjs(task.assignDateTime).format('YYYY-MM-DD HH:mm') }}
              </n-ellipsis>
            </span>
          </template>
        </n-card>
      </n-gi>
    </n-grid>
    <n-empty v-else class="h-[154px] pt-[35px]">
      暂时还没有可接受任务喔
    </n-empty>
  </n-card>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { PersonAddOutline, Search } from '@vicons/ionicons5'
import useGlobalStateStore from '@/store/globalState'
import { useMessage } from 'naive-ui'
import dayjs from 'dayjs'

const router = useRouter()
const message = useMessage()
const globalStateStoreStore = useGlobalStateStore()
const props = defineProps<{ allTasks: FLearningModels.Task[] }>()

const getNewRecommendBatch = () => {
  const batchSize = Math.min(3, props.allTasks.length)
  const newBatch = []
  for (let i = 0; i < batchSize; i += 1) {
    const index = Math.floor(Math.random() * props.allTasks.length)
    const newTask = props.allTasks[index]
    newBatch.push(newTask)
  }
  return newBatch
}

const searchContent = ref('')
const recommendTasks = ref()

const changeTaskBatch = () => {
  if (props.allTasks.length <= 3) {
    message.info('没有更多任务了:(')
  }
  recommendTasks.value = getNewRecommendBatch()
}

watchEffect(() => {
  recommendTasks.value = getNewRecommendBatch()
})

const searchTask = () => {
  globalStateStoreStore.searchTaskName = searchContent.value
  router.push({ name: 'TaskExplore' })
}

const viewRecommendTask = (taskName: string) => {
  globalStateStoreStore.searchTaskName = taskName
  router.push({ name: 'TaskExplore' })
}
</script>