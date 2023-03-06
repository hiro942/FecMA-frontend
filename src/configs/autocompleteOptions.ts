export const autocompleteEmailOptions = computed(() => (email: string) => {
  return ['@163.com', '@gmail.com', '@qq.com'].map((suffix) => {
    const prefix = email.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix,
    }
  })
})
