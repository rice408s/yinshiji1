export const formatDate = (date: Date | string, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
}

// 添加简短时间格式化函数
export const formatTime = (date: string | Date) => {
  let d: Date
  try {
    d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
  } catch (err) {
    return '--:--'
  }

  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${hour}:${minute}`
}
