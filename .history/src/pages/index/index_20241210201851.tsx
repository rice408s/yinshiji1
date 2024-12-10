import { View, Text } from '@tarojs/components'
import { useLoad, cloud, redirectTo } from '@tarojs/taro'
import './index.scss'

interface CloudResponse {
  result: {
    code: number
    message: string
    data?: any
  }
}

export default function Index() {
  useLoad(async () => {
    try {
      // 检查登录状态
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'checkLogin'
        }
      }) as CloudResponse

      if (result.code !== 200) {
        // 未登录,跳转到登录页
        redirectTo({
          url: '/pages/login/index'
        })
      }
    } catch (err) {
      console.error('检查登录状态失败:', err)
      redirectTo({
        url: '/pages/login/index'
      })
    }
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
    </View>
  )
}
