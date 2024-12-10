export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/login/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  cloud: true,
  permission: {
    'scope.userInfo': {
      desc: '您的用户信息将用于小程序登录'
    }
  }
})
