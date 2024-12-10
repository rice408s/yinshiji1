import { PropsWithChildren } from 'react'
import { useLaunch, cloud, switchTab } from '@tarojs/taro'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from './utils/auth'
import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(async () => {
    // 初始化云环境
    if (!cloud.initialized) {
      cloud.init({
        env: 'cloud1-6gei04vq0fba7479'
      })
    }

    // 检查本地登录状态
    const localUserInfo = getUserInfo()
    console.log('App启动 - 本地用户信息:', localUserInfo)

    if (localUserInfo) {
      try {
        // 验证服务器端登录状态
        const { result } = await cloud.callFunction({
          name: 'user',
          data: { action: 'checkLogin' }
        }) as any

        console.log('App启动 - 服务器验证结果:', result)

        if (result.code === 200) {
          // 更新本地存储
          setUserInfo(result.data.user)
          console.log('App启动 - 更新本地用户信息成功')

          // 跳转到首页
          switchTab({
            url: '/pages/index/index'
          })
        } else {
          console.log('App启动 - 服务器端登录已失效')
          clearUserInfo()
          // 保持在登录页
        }
      } catch (err) {
        console.error('App启动 - 验证登录状态失败:', err)
        clearUserInfo()
        // 保持在登录页
      }
    }
  })

  return children
}

export default App
