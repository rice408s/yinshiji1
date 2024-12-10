import { View, Text } from '@tarojs/components'
import { useLoad, cloud } from '@tarojs/taro'
import './index.scss'

export default function Index() {
  useLoad(() => {
    // 初始化云函数
    cloud.init({
      env: 'cloud1-6gei04vq0fba7479' // 替换为您的云环境ID
    })

    // 调用云函数示例
    cloud.callFunction({
      name: 'hello',
      data: {
        msg: 'from client'
      }
    }).then(res => {
      console.log('云函数调用成功:', res)
    }).catch(err => {
      console.error('云函数调用失败:', err)
    })
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
    </View>
  )
}
