import { View, Text, ScrollView } from '@tarojs/components'
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
      const res = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'checkLogin'
        }
      })

      const result = res.result as CloudResponse['result']

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
      {/* 顶部搜索栏 */}
      <View className='search-bar'>
        <View className='search-input'>
          <Text className='placeholder'>搜索</Text>
        </View>
      </View>

      {/* 功能导航 */}
      <View className='nav-grid'>
        <View className='nav-item'>
          <Text className='nav-text'>功能1</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能2</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能3</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能4</Text>
        </View>
      </View>

      {/* 内容列表 */}
      <View className='content-list'>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题1</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题2</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
