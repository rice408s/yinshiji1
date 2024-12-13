export const formatDate = (date: Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
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
