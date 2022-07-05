import { ElLoading } from 'element-plus'

// [Loading] 创建 loading 实例
export const createLoading = (loadingText: string) => ElLoading.service({
  lock: false,
  text: loadingText,
  background: 'rgba(0, 0, 0, 0.7)',
})

// [Table] 表头样式
export const tableHeaderCellStyle = () => ({
  height: '60px',
  border: '1px solid #FFF',
  color: '#111',
  backgroundColor: '#DEECFC',
})

// [Table] 单元格样式
export const tableCellStyle = (cell: any) => {
  if (cell.column.label === 'index') {
    return { border: '1px solid #fff', backgroundColor: '#EBEDF0' }
  }
  return { border: '1px solid #fff', backgroundColor: '#FAFBFC' }
}
