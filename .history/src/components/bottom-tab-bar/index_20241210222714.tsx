import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function BottomTabBar() {
  const handleTabClick = (path: string) => {
    Taro.reLaunch({ url: path })
  }

  // 获取当前页面路径
  const currentPage = Taro.getCurrentPages().pop()?.route || ''

  return (
    <View className='bottom-tab-bar'>
      <View
        className={`tab-item ${currentPage.includes('index') ? 'active' : ''}`}
        onClick={() => handleTabClick('/pages/index/index')}
      >
        <Text className='tab-text'>首页</Text>
      </View>
      <View
        className={`tab-item ${currentPage.includes('profile') ? 'active' : ''}`}
        onClick={() => handleTabClick('/pages/profile/index')}
      >
        <Text className='tab-text'>我的</Text>
      </View>
    </View>
  )
}
