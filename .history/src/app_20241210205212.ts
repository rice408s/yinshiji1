import { PropsWithChildren } from 'react'
import { useLaunch, cloud } from '@tarojs/taro'
import { checkIsLoggedIn, getUserInfo, setUserInfo } from './utils/auth'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(async () => {
    if (!cloud.initialized) {
      cloud.init({
        env: 'cloud1-6gei04vq0fba7479'
      })
    }

    // 检查本地登录状态
    const isLoggedIn = checkIsLoggedIn()
    console.log('App launched.', { isLoggedIn })

    if (isLoggedIn) {
      try {
        // 验证服务器端登录状态
        const { result } = await cloud.callFunction({
          name: 'user',
          data: {
            action: 'checkLogin'
          }
        })

        if (result.code === 200) {
          // 更新本地存储的用户信息
          setUserInfo(result.data.user)
        }
      } catch (err) {
        console.error('验证登录状态失败:', err)
      }
    }
  })

  return children
}

export default App
