export const formatDate = (date: string | Date) => {
  // 确保传入的日期是有效的
  let d: Date
  try {
    // 如果是字符串，先尝试转换
    d = typeof date === 'string' ? new Date(date) : date

    // 检查是否是有效日期
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
  } catch (err) {
    console.error('Date parsing error:', err)
    return '时间未知'
  }

  // 使用固定的格式化方式
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')

  return `${year}年${month}月${day}日 ${hour}:${minute}`
}

export const formatDateShort = (date: string | Date) => {
  let d: Date
  try {
    d = typeof date === 'string' ? new Date(date) : date
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date')
    }
  } catch (err) {
    return '时间未知'
  }

  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()

  if (isToday) {
    // 今天只显示时间
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    return `${hour}:${minute}`
  } else {
    // 非今天显示月日
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${month}-${day}`
  }
}
