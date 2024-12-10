import { View, Text, Image, ScrollView } from '@tarojs/components'
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
          <Text className='iconfont icon-search'></Text>
          <Text className='placeholder'>搜索</Text>
        </View>
      </View>

      {/* 轮播图区域 */}
      <View className='banner'>
        {/* 这里可以添加轮播图组件 */}
      </View>

      {/* 功能导航 */}
      <View className='nav-grid'>
        <View className='nav-item'>
          <Text className='iconfont icon-menu1'></Text>
          <Text className='nav-text'>功能1</Text>
        </View>
        <View className='nav-item'>
          <Text className='iconfont icon-menu2'></Text>
          <Image className='nav-icon' src='../../assets/icons/menu2.png' />
          <Text className='nav-text'>功能2</Text>
        </View>
        {/* 更多导航项... */}
      </View>

      {/* 内容列表 */}
      <ScrollView className='content-list' scrollY>
        <View className='content-item'>
          <Image className='content-image' src='../../assets/images/demo1.jpg' />
          <View className='content-info'>
            <Text className='title'>内容标题1</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
        {/* 更多内容项... */}
      </ScrollView>
    </View>
  )
}
