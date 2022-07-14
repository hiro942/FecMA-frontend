import {
  getLocal,
  insertLocal,
  LocalStorage,
  removeLocal,
} from '@/utils/localStorage'
import { fetchCallbackResult } from '@/api/fLearning'
import { ElMessage, ElNotification } from 'element-plus'
import { timeFormatter } from '@/utils/formatters'
import useStyleStore from '@/store/modules/style'
import { CallbackResult } from '@/constants/api'

export const watchAsyncResult = (localName: string) => {
  const local = getLocal(localName)
  if (!local) {
    return
  }

  const { taskName, callbackURL } = local.data
  console.log('【watchAsyncResult】开始监听，回调URL为', callbackURL)

  const styleStore = useStyleStore()

  let successMessage: string
  let errorMessage: string

  if (localName === LocalStorage.AssignResultCallback) {
    styleStore.assignBtnLoading = true // assign 按钮禁用
    successMessage = `任务 "${taskName}" 创建成功`
    errorMessage = `服务器错误，任务 "${taskName}" 创建失败`
  } else if (localName === LocalStorage.AcceptResultCallback) {
    successMessage = `任务 "${taskName}" 接收成功`
    errorMessage = `服务器错误，任务 "${taskName}" 接收失败`
  } else if (localName === LocalStorage.TrainResultCallback) {
    successMessage = `任务 "${taskName}" 已训练完成`
    errorMessage = `服务器错误，任务 "${taskName}" 训练失败`
  }

  const timer = setInterval(async () => {
    const result = await fetchCallbackResult(callbackURL)

    if (!CallbackResult.Pending.includes(result)) {
      removeLocal(localName)

      const timePrefix = `[${timeFormatter(new Date().toJSON())}] `
      if (result === CallbackResult.Success) {
        insertLocal(LocalStorage.Messages, timePrefix + successMessage)
        ElMessage.success(successMessage)
      }

      if (result === CallbackResult.Error) {
        insertLocal(LocalStorage.Messages, timePrefix + errorMessage)
        ElMessage.error(errorMessage)
      }

      if (localName === LocalStorage.AssignResultCallback) {
        styleStore.assignBtnLoading = false // assign 按钮解禁
      }

      clearInterval(timer)
    }
  }, 2000)
}
