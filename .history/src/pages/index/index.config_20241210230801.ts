export default definePageConfig({
  navigationBarTitleText: '食物分析',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f8f9fa',
  // 显示返回按钮，点击时跳转到个人中心
  navigationStyle: 'default',
  navigationBarBackButton: true,
  onNavigateBack: () => {
    Taro.navigateTo({
      url: '/pages/profile/index'
    })
    return true // 阻止默认的返回行为
  }
})
