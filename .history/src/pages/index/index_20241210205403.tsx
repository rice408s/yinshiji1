import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, redirectTo, cloud } from '@tarojs/taro'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import './index.scss'

export default function Index() {
  useLoad(async () => {
    // 检查本地登录状态
    const localUserInfo = getUserInfo()
    console.log('首页加载 - 本地用户信息:', localUserInfo)

    if (!checkIsLoggedIn()) {
      console.log('首页加载 - 未登录，跳转登录页')
      redirectTo({ url: '/pages/login/index' })
      return
    }

    try {
      console.log('首页加载 - 验证服务器登录状态')
      const { result } = (await cloud.callFunction({
        name: 'user',
        data: { action: 'checkLogin' }
      }) as unknown) as CloudResponse

      console.log('首页加载 - 服务器返回:', result)

      if (result.code === 200) {
        console.log('首页加载 - 登录有效，更新用户信息')
        setUserInfo(result.data.user)
      } else {
        console.log('首页加载 - 登录失效，清除状态')
        clearUserInfo()
        redirectTo({ url: '/pages/login/index' })
      }
    } catch (err) {
      console.error('首页加载 - 验证登录状态失败:', err)
      clearUserInfo()
      redirectTo({ url: '/pages/login/index' })
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