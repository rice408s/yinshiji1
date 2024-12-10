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
        iconPath: 'https://img.icons8.com/ios/50/000000/home.png',
        selectedIconPath: 'https://img.icons8.com/ios-filled/50/07c160/home.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'https://img.icons8.com/ios/50/000000/user.png',
        selectedIconPath: 'https://img.icons8.com/ios-filled/50/07c160/user.png'
      }
    ]
  },
  cloud: true,
  requiredPrivateInfos: ['getLocation'],
  requiredBackgroundModes: ['audio']
})
