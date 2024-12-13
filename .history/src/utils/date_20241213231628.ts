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

// 获取当前本地时间
export const getCurrentLocalTime = () => {
  return formatLocalTime(new Date())
}

// 格式化时间为 HH:mm
export const formatTimeString = (date: Date | string) => {
  const d = formatLocalTime(date)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

// 格式化日期为 YYYY-MM-DD
export const formatDateString = (date: Date | string) => {
  const d = formatLocalTime(date)
  return d.toISOString().split('T')[0]
}