// 处理时区偏移
export const formatLocalTime = (date: Date | string) => {
  const d = new Date(date)
  return d
}

// 格式化日期时间
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date)
  return {
    date: d.toISOString().split('T')[0],
    time: `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
  }
}

// 获取当前本地时间
export const getCurrentLocalTime = () => {
  return formatLocalTime(new Date())
}

// 格式化时间为 HH:mm
export const formatTimeString = (date: Date | string) => {
  const d = new Date(date)
  // 使用 UTC 时间
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
}

// 格式化日期为 YYYY-MM-DD
export const formatDateString = (date: Date | string) => {
  const d = formatLocalTime(date)
  return d.toISOString().split('T')[0]
}
