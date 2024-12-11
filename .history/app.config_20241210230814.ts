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
  },
  tabBar: {
    color: '#999',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '分析',
        iconPath: 'assets/icons/analyze.png',
        selectedIconPath: 'assets/icons/analyze-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/profile.png',
        selectedIconPath: 'assets/icons/profile-active.png'
      }
    ]
  }
})
