import type { UserConfigExport } from '@tarojs/cli'

const emptyIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default {
  entryPagePath: 'pages/login/index',
  pages: [
    'pages/login/index',
    'pages/index/index',
    'pages/profile/index',
    'pages/publish/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: false,
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/index/index',
        text: '+',
        iconPath: emptyIcon,
        selectedIconPath: emptyIcon
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ],
    color: '#999999',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black'
  }
} as UserConfigExport