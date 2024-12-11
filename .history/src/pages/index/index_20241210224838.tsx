import { View } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import CustomNavigationBar from '../../components/custom-navigation-bar'
import './index.scss'

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <CustomNavigationBar mode='home' title='首页' />

      {/* 内容区域 */}
      <View className='content'>
        首页内容
      </View>
    </View>
  )
}
