import Taro from '@tarojs/taro'

// 创建一个24x24的空白PNG图标
export function createEmptyIcon(color: string = '#999999'): string {
  const canvas = Taro.createOffscreenCanvas({ type: '2d', width: 24, height: 24 })
  const ctx = canvas.getContext('2d')

  // 清空画布
  ctx.clearRect(0, 0, 24, 24)

  // 绘制一个圆形
  ctx.beginPath()
  ctx.arc(12, 12, 8, 0, 2 * Math.PI)
  ctx.fillStyle = color
  ctx.fill()

  // 转换为base64
  const buffer = canvas.toDataURL('image/png')
  return buffer
}
