// 处理时区偏移
export const formatLocalTime = (date: Date | string) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset() * 60000 // 获取本地时区偏移(毫秒)
  const localDate = new Date(d.getTime() - offset) // 调整为本地时间
  return localDate
}

// 格式化日期时间
export const formatDateTime = (date: Date | string) => {
  const d = formatLocalTime(date)
  return {
    date: d.toISOString().split('T')[0], // YYYY-MM-DD
    time: d.toISOString().split('T')[1].substring(0, 5) // HH:mm
  }
}
