export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/index',
    'pages/login/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // 设置首页不显示返回按钮
  entryPagePath: 'pages/index/index'
})
