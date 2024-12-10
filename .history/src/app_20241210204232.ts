import { PropsWithChildren } from 'react'
import { useLaunch, cloud } from '@tarojs/taro'
import { checkIsLoggedIn } from './utils/auth'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    if (!cloud.initialized) {
      cloud.init({
        env: 'cloud1-6gei04vq0fba7479'
      })
    }

    // 检查登录状态
    const isLoggedIn = checkIsLoggedIn()
    console.log('App launched.', { isLoggedIn })
  })

  return children
}

export default App
