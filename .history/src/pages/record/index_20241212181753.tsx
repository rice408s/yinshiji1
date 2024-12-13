import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import './index.scss'

definePageConfig({
  navigationBarTitleText: '记录详情'
})

export default function Record() {
  const router = useRouter()
  console.log('页面参数:', router.params)  // 添加日志

  return (
    <View className='record'>
      <Text>测试页面</Text>
      <Text>ID: {router.params.id}</Text>
    </View>
  )
}
