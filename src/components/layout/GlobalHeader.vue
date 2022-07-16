<template>
  <div class="app-header">
    <el-header class="controllers">
      <menu-collapse-controller />
      <div style="flex: 1" />
      <reload-toggle />
      <full-screen-toggle />
      <message-toggle />
      <avatar-dropdown />
    </el-header>

    <div class="router-history">
      <el-tabs
        v-model="activeHistory"
        type="card"
        :style="{ borderColor: 'transparent' }"
        :closable="!(historys.length === 1 && route.name === defaultRoute.name)"
        @tab-change="tabChange"
        @tab-remove="tabRemove"
      >
        <el-tab-pane
          v-for="item in historys"
          :key="name(item)"
          :label="item.meta?.title"
          :name="name(item)"
        >
          <template #label>
            <span
              :style="{
                color:
                  activeHistory === name(item) ? layoutStore.activeColor : '',
              }"
            >
              <i
                class="dot"
                :style="{
                  backgroundColor:
                    activeHistory === name(item) ? layoutStore.activeColor : '',
                }"
              />
              {{ item.meta?.title }}
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuCollapseController from '@/components/header/MenuCollapseController.vue'
import FullScreenToggle from '@/components/header/FullScreenToggle.vue'
import AvatarDropdown from '@/components/header/AvatarDropdown.vue'
import MessageToggle from '@/components/header/MessageToggle.vue'
import { nextTick, onMounted, ref, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import useStyleStore from '@/store/modules/style'
import ReloadToggle from '@/components/header/ReloadToggle.vue'

type routeLoc = RouteLocationNormalizedLoaded

interface historyV {
  name: string
  meta: any
  query: any
  params: any
}

const route = useRoute()
const router = useRouter()

const defaultRoute = ref<historyV>({
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
  },
  query: {},
  params: {},
})

const layoutStore = useStyleStore()

const historys = ref<historyV[]>([])
const historysMap = ref<any>({})
const activeHistory = ref('')

const getFmtString = (item: historyV | routeLoc) =>
  (item.name as string) +
  JSON.stringify(item.query) +
  JSON.stringify(item.params)

const name = (item: historyV) =>
  item.name + JSON.stringify(item.query) + JSON.stringify(item.params)

const setTab = (route: routeLoc) => {
  if (historys.value.some((item: historyV) => isSame(item, route))) {
    return
  }
  historys.value.push({
    name: route.name as string,
    meta: { ...route.meta },
    query: route.query,
    params: route.params,
  })
}

const isSame = (route1: historyV, route2: routeLoc) =>
  route1.name === route2.name

const tabChange = (name: string) => {
  const tab: historyV = historysMap.value[name]
  router.push({
    name: tab.name,
    query: tab.query,
    params: tab.params,
  })
}

const tabRemove = (name: string) => {
  const index = historys.value.findIndex((item) => getFmtString(item) === name)
  const historysLength = historys.value.length

  if (getFmtString(route) === name) {
    if (historysLength === 1) {
      router.push(defaultRoute.value)
    } else if (index === historysLength - 1) {
      router.push({
        name: historys.value[index - 1].name,
        query: historys.value[index - 1].query,
        params: historys.value[index - 1].params,
      })
    } else {
      router.push({
        name: historys.value[index + 1].name,
        query: historys.value[index + 1].query,
        params: historys.value[index + 1].params,
      })
    }
  }

  historys.value.splice(index, 1)
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
  () => historys.value,
  () => {
    sessionStorage.setItem('historys', JSON.stringify(historys.value))
    // sessionStorage.setItem('activeHistory', getFmtString(route))

    historysMap.value = {}
    historys.value.forEach((item) => {
      historysMap.value[getFmtString(item)] = item
    })
  },
  { deep: true }
)

// 初始化
onMounted(() => {
  const initHistorys: historyV[] = [defaultRoute.value]

  // // 初始化historys
  const sessionHistory = sessionStorage.getItem('historys')
  historys.value = sessionHistory ? JSON.parse(sessionHistory) : initHistorys

  // 初始化activeHistory
  const sessionActiveHistory = sessionStorage.getItem('activeHistory')
  activeHistory.value = sessionActiveHistory || getFmtString(route)

  setTab(route)
})
</script>

<script lang="ts">
export default {
  name: 'GlobalHeader',
}
</script>

<style scoped lang="scss">
.app-header {
  height: var(--height-header);
  position: fixed;
  top: 0;
  z-index: 999;
  background-color: var(--bg-color-header);

  .controllers {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.router-history {
  height: var(--height-header-router-history);
  border-top: 1px solid #f4f4f4;

  .dot {
    display: inline-block;
    width: 9px;
    height: 9px;
    margin-right: 5px;
    border-radius: 50%;
    background-color: #ddd;
    transition: background-color 0.2s;
  }
}
</style>
