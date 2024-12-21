// 处理时区偏移
export const formatLocalTime = (date: Date | string) => {
  const d = new Date(date)
  return d
}

// 格式化日期时间
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date)
  return {
    date: d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-'),
    time: d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
}

// 获取当前本地时间
export const getCurrentLocalTime = () => {
  return formatLocalTime(new Date())
}

// 格式化时间为 HH:mm
export const formatTimeString = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

// 格式化日期为 YYYY-MM-DD
export const formatDateString = (date: Date | string) => {
  const d = formatLocalTime(date)
  return d.toISOString().split('T')[0]
}

// 添加新的格式化函数
export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}
