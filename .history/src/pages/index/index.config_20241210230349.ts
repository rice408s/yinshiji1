export default definePageConfig({
  navigationBarTitleText: '食物分析',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f8f9fa',
  navigationStyle: 'default',
  navigationBarBackButton: true,
  onBackClick: () => {
    Taro.navigateTo({
      url: '/pages/profile/index'
    })
    return true
  }
})
