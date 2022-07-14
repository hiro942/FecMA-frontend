import { ElNotification } from 'element-plus'

export const errorCatcher = (err: any) => {
  if (err instanceof Error) {
    ElNotification.error(err.message)
  }
}
