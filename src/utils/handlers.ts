import { ElMessage } from 'element-plus'

export const errorCatcher = (err: any) => {
  if (err instanceof Error) {
    ElMessage.error(err.message)
  }
}
