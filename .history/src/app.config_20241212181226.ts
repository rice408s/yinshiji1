import type { UserConfigExport } from '@tarojs/cli'

export default {
  entryPagePath: 'pages/index/index',
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/record/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '饮食记录',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: false,
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './assets/icons/home.png',
        selectedIconPath: './assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/icons/user.png',
        selectedIconPath: './assets/icons/user-active.png'
      }
    ],
    color: '#999999',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black'
  }
} as UserConfigExport
