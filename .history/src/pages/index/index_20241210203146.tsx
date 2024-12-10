import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('首页加载')
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
