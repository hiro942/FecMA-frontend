<template>
  <div class="router-history">
    <n-tabs
      type="card"
      default-value="dashboard"
      v-model:value="activeHistory"
      animated
      :closable="
        !(histories.length === 1 && histories[0].name === defaultRoute.name)
      "
      tab-style=""
      @close="tabRemove"
      @update:value="tabChange"
    >
      <n-tab-pane
        v-for="item in histories"
        :key="getName(item)"
        :name="getName(item)"
        :tab="item.meta?.title"
      >
        <template #tab>
          <span>
            <i />
            {{ item.meta?.title }}
          </span>
        </template>
      </n-tab-pane>
    </n-tabs>

    <!--    <el-tabs-->
    <!--      v-model="activeHistory"-->
    <!--      type="card"-->
    <!--      :style="{ borderColor: 'transparent' }"-->
    <!--      :closable="!(histories.length === 1 && route.name === defaultRoute.name)"-->
    <!--      @tab-change="tabChange"-->
    <!--      @tab-remove="tabRemove"-->
    <!--    >-->
    <!--      <el-tab-pane-->
    <!--        v-for="item in histories"-->
    <!--        :key="getName(item)"-->
    <!--        :label="item.meta?.title + route.params?.modelID"-->
    <!--        :name="getName(item)"-->
    <!--      >-->
    <!--        <template #label>-->
    <!--          <span-->
    <!--            :style="{-->
    <!--              color: activeHistory === getName(item) ? '#4D70FF' : '',-->
    <!--            }"-->
    <!--          >-->
    <!--            <i-->
    <!--              class="dot"-->
    <!--              :style="{-->
    <!--                backgroundColor:-->
    <!--                  activeHistory === getName(item)-->
    <!--                    ? layoutStore.activeColor-->
    <!--                    : '',-->
    <!--              }"-->
    <!--            />-->
    <!--            {{ item.meta?.title }}-->
    <!--          </span>-->
    <!--        </template>-->
    <!--      </el-tab-pane>-->
    <!--    </el-tabs>-->
  </div>
</template>

<script setup lang="ts">
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import useStyleStore from '@/store/style'
import { notEqual } from 'assert'

const route = useRoute()
const router = useRouter()

type History = {
  name: string
  meta: any
  query: any
  params: any
}

const defaultRoute = ref<History>({
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
  },
  query: {},
  params: {},
})

const layoutStore = useStyleStore()

const histories = ref<History[]>([])
const historiesMap = ref<any>({})
const activeHistory = ref('')

const getFmtString = (item: History | RouteLocationNormalizedLoaded) =>
  (item.name as string) +
  JSON.stringify(item.query) +
  JSON.stringify(item.params)

const getName = (item: History) =>
  item.name + JSON.stringify(item.query) + JSON.stringify(item.params)

const isSame = (route1: History, route2: RouteLocationNormalizedLoaded) =>
  route1.name === route2.name &&
  JSON.stringify(route1.params) === JSON.stringify(route2.params)
// route1.name === route2.name

const setTab = (routeLoc: RouteLocationNormalizedLoaded) => {
  if (histories.value.some((item: History) => isSame(item, routeLoc))) {
    return
  }
  histories.value.push({
    name: routeLoc.name as string,
    meta: { ...routeLoc.meta },
    query: routeLoc.query,
    params: routeLoc.params,
  })
}

const tabChange = (name: string) => {
  const tab: History = historiesMap.value[name]
  router.push({
    name: tab.name,
    query: tab.query,
    params: tab.params,
  })
}

const tabRemove = (name: string) => {
  const index = histories.value.findIndex((item) => getFmtString(item) === name)
  const historiesLength = histories.value.length

  if (getFmtString(route) === name) {
    if (historiesLength === 1) {
      router.push(defaultRoute.value)
    } else if (index === historiesLength - 1) {
      router.push({
        name: histories.value[index - 1].name,
        query: histories.value[index - 1].query,
        params: histories.value[index - 1].params,
      })
    } else {
      router.push({
        name: histories.value[index + 1].name,
        query: histories.value[index + 1].query,
        params: histories.value[index + 1].params,
      })
    }
  }

  histories.value.splice(index, 1)
}

// 监听激活的路由变化
watch(
  () => route,
  (to) => {
    activeHistory.value = getFmtString(to)
    sessionStorage.setItem('activeHistory', getFmtString(to))

    setTab(to)
  },
  { deep: true }
)

// 实时保存最新的路由历史
watch(
  () => histories.value,
  () => {
    sessionStorage.setItem('histories', JSON.stringify(histories.value))

    historiesMap.value = {}
    histories.value.forEach((item) => {
      historiesMap.value[getFmtString(item)] = item
    })
  },
  { deep: true }
)

// 初始化
onMounted(() => {
  const initHistories: History[] = [defaultRoute.value]

  // // 初始化histories
  const sessionHistory = sessionStorage.getItem('histories')
  histories.value = sessionHistory ? JSON.parse(sessionHistory) : initHistories

  // 初始化activeHistory
  const sessionActiveHistory = sessionStorage.getItem('activeHistory')
  activeHistory.value = sessionActiveHistory || getFmtString(route)
})
</script>
