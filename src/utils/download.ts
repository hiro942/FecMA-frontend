export const download = (downloadData: any, downloadFilename: string) => {
  const blob = new Blob([downloadData])
  const dom = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  dom.href = url
  dom.download = downloadFilename
  dom.style.display = 'none'
  document.body.appendChild(dom)
  dom.click()
  document.body.removeChild(dom)
  window.URL.revokeObjectURL(url)
}
