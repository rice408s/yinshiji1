import { View, Text } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import './index.scss'

export default function Record() {
  const router = useRouter()
  console.log('页面参数:', router.params)

  return (
    <View className='record'>
      <Text>测试页面</Text>
      <Text>ID: {router.params.id}</Text>
    </View>
  )
}
