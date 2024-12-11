import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface Props {
  title?: string
  showBack?: boolean
}

export default function CustomNavigationBar({ title, showBack = false }: Props) {
  const handleBack = () => {
    Taro.navigateBack()
  }

  return (
    <View className='custom-nav'>
      <View className='nav-content'>
        {showBack && (
          <View className='back-btn' onClick={handleBack}>
            <Text className='iconfont icon-back'></Text>
          </View>
        )}
        <Text className='title'>{title}</Text>
      </View>
    </View>
  )
}
