import { PropsWithChildren } from 'react'
import { useLaunch, cloud, getAppBaseInfo, getSystemSetting } from '@tarojs/taro'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    // 初始化云开发环境
    if (!cloud.initialized) {
      cloud.init({
        env: 'cloud1-6gei04vq0fba7479'
      })
    }

    // 获取系统信息
    const appBaseInfo = getAppBaseInfo()
    const systemSetting = getSystemSetting()

    console.log('App launched.', {
      appBaseInfo,
      systemSetting
    })
  })

  // children 是将要会渲染的页面
  return children
}



export default App
