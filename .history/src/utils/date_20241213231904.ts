// 将 UTC 时间转换为本地时间字符串
export const formatDateTime = (utcDate: Date | string) => {
  const d = new Date(utcDate)
  return {
    date: d.toISOString().slice(0, 10), // YYYY-MM-DD
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
}

// 将本地时间转换为 UTC 时间
export const localToUTC = (date: string, time: string) => {
  const [year, month, day] = date.split('-').map(Number)
  const [hours, minutes] = time.split(':').map(Number)

  const localDate = new Date(year, month - 1, day, hours, minutes)
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000)
}

// 格式化显示时间
export const formatDisplayTime = (date: Date | string) => {
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
