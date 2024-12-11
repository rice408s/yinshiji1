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
  // 设置主页的自定义配置
  customConfig: {
    'pages/index/index': {
      navigationStyle: 'custom',  // 隐藏原生导航栏
      disableScroll: true  // 禁用页面滚动
    }
  }
})
