<template>
  <el-dialog
    v-model="globalStateStore.userInfoResetDialogVisible"
    :title="'重置' + AliasCN[props.resetKey]"
    width="40%"
  >
    <el-input v-model="newVal" placeholder="Please input" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submitUserInfoReset">
          提交
        </el-button>
        <el-button
          type="danger"
          @click="globalStateStore.userInfoResetDialogVisible = false"
        >
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AliasCN, NameRegExp, EmailRegExp } from '@/constants'
import useGlobalStateStore from '@/store/modules/globalState'
import { ElMessage } from 'element-plus'
import { resetUserInfo } from '@/api/user'

const props = defineProps<{
  resetKey: string
  currentVal: string
}>()

const globalStateStore = useGlobalStateStore()
const newVal = ref(props.currentVal)

const submitUserInfoReset = async () => {
  if (props.resetKey === 'email') {
    if (EmailRegExp.test(newVal.value)) {
      ElMessage.error('邮箱格式不正确')
      return
    }
    try {
      await resetUserInfo({ email: newVal.value })
    } catch (err) {
      ElMessage.error((err as Error).message)
    }
  }

  if (props.resetKey === 'nickname') {
    if (NameRegExp.test(newVal.value)) {
      ElMessage.error('昵称输入不合法')
      return
    }
    try {
      await resetUserInfo({ nickname: newVal.value })
    } catch (err) {
      ElMessage.error((err as Error).message)
    }
  }
}
</script>

<script lang="ts">
export default {
  name: 'UserInfoResetDialog',
}
</script>

<style scoped></style>
