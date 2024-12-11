import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import CustomNavigationBar from '../../components/custom-navigation-bar'
import './index.scss'

export default function Profile() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='profile'>
      <CustomNavigationBar mode='back' title='个人中心' />

      {/* 内容区域 */}
      <View className='content'>
        个人中心内容
      </View>
    </View>
  )
}
