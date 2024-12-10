export default defineAppConfig({
  pages: [
    'pages/login/index',
    'pages/index/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: false,
    color: '#999',
    selectedColor: '#07c160',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'https://example.com/icons/home.png',
        selectedIconPath: 'https://example.com/icons/home-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'https://example.com/icons/profile.png',
        selectedIconPath: 'https://example.com/icons/profile-active.png'
      }
    ]
  },
  cloud: true
})
