import { View, Text } from '@tarojs/components'

export default function Header() {
  return (
    <View className='header'>
      <View className='title'>
        美食雷达
        <Text className='subtitle'>智能识别 · 探寻美味</Text>
      </View>
    </View>
  )
}
