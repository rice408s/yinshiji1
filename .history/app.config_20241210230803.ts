export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/index',
    'pages/login/index'
  ],
  window: {
    navigationBarTitleText: '食物分析',
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8f9fa',
    navigationStyle: 'default'
  }
  // ... 其他配置
})
