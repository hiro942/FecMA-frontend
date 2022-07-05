<template>
  <div class="app-header">
    <el-header class="top-info">
      <menu-collapse-controller />
      <div style="flex: 1" />
      <full-screen-toggle style="margin-right: 20px" />
      <avatar-dropdown />
    </el-header>

    <div class="router-history">
      <el-tabs
        v-model="activeHistory"
        type="card"
        :style="{ borderColor: 'transparent' }"
        :closable="
          !(historys.length === 1 && route.name === defaulteRoute.name)
        "
        @tab-change="tabChange"
        @tab-remove="tabRemove"
      >
        <el-tab-pane
          v-for="item in historys"
          :key="name(item)"
          :label="item.meta.title"
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
              {{ item.meta.title }}
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
import { ref, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'
import useLayoutStore from '@/store/modules/layout'

type routeLoc = RouteLocationNormalizedLoaded

interface historyV {
  name: string
  meta: any
  query: any
  params: any
}

const route = useRoute()
const router = useRouter()
const defaulteRoute = ref<historyV>({
  name: 'Dashboard',
  meta: {
    title: 'Dashboard',
  },
  query: {},
  params: {},
})

const layoutStore = useLayoutStore()

const historys = ref<historyV[]>([])
const historysMap = ref<any>({})
const activeHistory = ref('')

const getFmtString = (item: historyV | routeLoc) => {
  const res =
    (item.name as string) +
    JSON.stringify(item.query) +
    JSON.stringify(item.params)

  return res
}

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

const isSame = (route1: historyV, route2: routeLoc) => {
  if (route1.name !== route2.name) {
    return false
  }
  return true
}

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
      router.push(defaulteRoute.value)
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

watch(
  () => route,
  (to) => {
    activeHistory.value = getFmtString(to)
    sessionStorage.setItem('activeHistory', getFmtString(to))

    setTab(to)
  },
  { deep: true },
)

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
  { deep: true },
)

const initPage = () => {
  const initHistorys: historyV[] = [defaulteRoute.value]

  // // 初始化historys
  const sessionHistory = sessionStorage.getItem('historys')
  historys.value = sessionHistory ? JSON.parse(sessionHistory) : initHistorys

  // 初始化activeHistory
  const sessionActiveHistory = sessionStorage.getItem('activeHistory')
  activeHistory.value = sessionActiveHistory || getFmtString(route)

  setTab(route)
}
initPage()
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

  .top-info {
    display: flex;
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
