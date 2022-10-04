<template>
  <div id="space">
    <div class="left-content">
      <el-image
        class="avatar-box"
        :src="userInfo.avatarUrl || DEFAULT_AVATAR"
        @click="onClickAvatar"
      >
        <template #error>
          <el-icon size="120px"><icon-picture /></el-icon>
        </template>
      </el-image>

      <div style="text-align: left; width: 100%">
        <div class="left-item">
          <el-icon><User /></el-icon>
          <span class="item-text">{{ AliasCN[userInfo.role] }}</span>
        </div>
        <div class="left-item">
          <el-icon><House /></el-icon>
          <span class="item-text">{{ userInfo.org }}</span>
        </div>
      </div>
    </div>

    <div class="right-content">
      <template v-for="(val, key) in userInfo" :key="key">
        <div
          v-if="key === 'email' || key === 'nickname'"
          class="user-info-item"
        >
          <div style="font-size: 20px">
            {{ AliasCN[key] }}
          </div>
          <div style="display: flex">
            <div v-if="!val" style="flex: 1">无</div>
            <div v-else style="flex: 1; color: #666">{{ val }}</div>
            <el-button
              link
              type="primary"
              @click="viewUserInfoResetDialog(key, val)"
            >
              修改
            </el-button>
          </div>
        </div>
      </template>
    </div>

    <UserInfoResetDialog
      v-if="selectedKey"
      :reset-key="selectedKey"
      :current-val="selectedVal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Picture as IconPicture, User, House } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import useGlobalStateStore from '@/store/modules/globalState'
import { DEFAULT_AVATAR } from '@/constants/global'
import UserInfoResetDialog from '@/components/user/UserInfoResetDialog.vue'
import { AliasCN } from '@/constants/alias'
import { useMessage } from 'naive-ui'

const message = useMessage()

const { userInfo } = useUserStore()
const globalStateStore = useGlobalStateStore()
const selectedKey = ref()
const selectedVal = ref()

// 显示修改用户信息对话框
const viewUserInfoResetDialog = (
  resetKey: string,
  currentVal: number | string
) => {
  selectedKey.value = resetKey
  selectedVal.value = currentVal
  globalStateStore.userInfoResetModalVisible = true
}

// [Avatar] 点击事件回调
const onClickAvatar = () => {
  message.info('[test]点击头像')
}
</script>

<style scoped lang="scss">
#space {
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  grid-column-gap: 50px;

  .left-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: -2px 0 20px -16px;
    padding: 20px 20px;

    .avatar-box {
      height: 160px;
      width: 160px;
      cursor: pointer;
      margin-bottom: 30px;
    }

    .left-item {
      font-size: 18px;
      padding: 20px 10px;

      .item-text {
        margin-left: 20px;
      }
    }
  }

  .right-content {
    .user-info-item {
      margin: 10px 0;
      padding: 20px;
      text-align: left;
    }
  }
}
</style>
