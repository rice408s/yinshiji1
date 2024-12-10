import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, redirectTo, cloud } from '@tarojs/taro'
import { checkIsLoggedIn, getUserInfo, setUserInfo } from '../../utils/auth'
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
    // 先检查本地登录状态
    if (!checkIsLoggedIn()) {
      redirectTo({
        url: '/pages/login/index'
      })
      return
    }

    try {
      // 验证服务器端登录状态并更新用户信息
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'checkLogin'
        }
      })

      if (result.code === 200) {
        // 更新本地存储的用户信息
        setUserInfo(result.data.user)
      } else {
        // 服务器端登录失效，清除本地状态
        redirectTo({
          url: '/pages/login/index'
        })
      }
    } catch (err) {
      console.error('验证登录状态失败:', err)
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
