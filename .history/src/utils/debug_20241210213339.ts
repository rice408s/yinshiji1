export const debugElement = (element: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('========== 元素调试信息 ==========')
    console.log('类名:', element.className)
    console.log('样式:', element.style)
    console.log('位置:', {
      offsetTop: element.offsetTop,
      offsetLeft: element.offsetLeft
    })
    console.log('大小:', {
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight
    })
    console.log('================================')
  }
}
