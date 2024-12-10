// 创建一个1x1像素的透明PNG
const createEmptyIcon = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = 'transparent'
    ctx.fillRect(0, 0, 1, 1)
  }
  return canvas.toDataURL('image/png')
}

export const emptyIcon = createEmptyIcon()
