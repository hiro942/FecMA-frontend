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
import useGlobalStateStore from '@/store/modules/globalState'
import { ElMessage } from 'element-plus'
import { resetUserInfo } from '@/api/user'
import { EmailRegExp, NameRegExp } from '@/utils/validators'
import { AliasCN } from '@/constants/alias'
import { useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps<{
  resetKey: string
  currentVal: string
}>()

const globalStateStore = useGlobalStateStore()
const newVal = ref(props.currentVal)

const submitUserInfoReset = async () => {
  if (props.resetKey === 'email') {
    if (!EmailRegExp.test(newVal.value)) {
      message.error('邮箱格式不正确')
      return
    }
    try {
      await resetUserInfo({ newVal: newVal.value })
      message.success('邮箱已重置')
    } catch (err: any) {
      message.error(err.message)
    }
  }

  if (props.resetKey === 'nickname') {
    if (!NameRegExp.test(newVal.value)) {
      message.error('昵称输入不合法')
      return
    }
    try {
      await resetUserInfo({ newVal: newVal.value })
      message.success('昵称已重置')
    } catch (err: any) {
      message.error(err.message)
    }
  }

  globalStateStore.userInfoResetDialogVisible = false
}
</script>

<style scoped></style>
