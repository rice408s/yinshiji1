import type { UserConfigExport } from '@tarojs/cli'

const emptyIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

// 加号图标的 base64
const plusIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAbZJREFUaEPtmTFOw0AQRf/sOnRUVEhUVJyBA3ACTkBFyQE4BEdIRUFFg0SFRMcBYq/0LRu8JF7veu21BZp0Tux9b97M7NqJMPKHRq4fk4BJYOgOTRYaugPD8ZOFhlvjvwn8KHAcx0UAiwBWzrmvlEBTAma2BLAC8Jo4XwN4d85tUyCaETCzRwCPABYpxQbnHgDcOee+Y2u0IGBmKv4NwDxWbMb5TwA3zrm9r24LArcAXmYUGXPpnXPuI3ZBEwJmtgHwHCsy4/zWObeMXdOKwBLA0PfA1jm3il3QhIBawMweANzHiow5T7XQE4DHhgQkKtVCdw0JqIV0iX0CeGpIQGfeKwBvrQoMdQ/UEHgB8NyQwA7AunULjb4HhiaQ2kJjF5gsNNYWKu4BM9sAeK8h8M+7UPEeMLOUf+LGCBwAvKvFYwScc3KqJY+ZPQHYOOd2EQKy0h2A25oW0lHiLUagWEAXm9kOwHVECx0BXDnnNgkCRQLFLaQPNDO1Tl8LHQFcOuc+IwSKBYpbyMwuALzFCAAoEigWiDH7r3OTwKl3O/b6yUKxHTt1frLQqTs89vrJQrEdO3X+D4J3kDG7xcX6AAAAAElFTkSuQmCC'

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
        text: '首页',
        iconPath: emptyIcon,
        selectedIconPath: emptyIcon
      },
      {
        pagePath: 'pages/index/index',
        text: '',
        iconPath: plusIcon,
        selectedIconPath: plusIcon
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: emptyIcon,
        selectedIconPath: emptyIcon
      }
    ],
    color: '#999999',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black'
  }
} as UserConfigExport
