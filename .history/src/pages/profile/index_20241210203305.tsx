import { View, Text, Button } from '@tarojs/components'
import { useLoad, cloud } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface UserInfo {
  avatarUrl: string
  nickName: string
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useLoad(async () => {
    try {
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'checkLogin'
        }
      })

      if (result.code === 200) {
        setUserInfo(result.data.user)
      }
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  })

  return (
    <View className='profile'>
      <View className='user-card'>
        <Text className='nickname'>{userInfo?.nickName || '未登录'}</Text>
      </View>

      <View className='menu-list'>
        <View className='menu-item'>
          <Text className='text'>个人设置</Text>
        </View>
        <View className='menu-item'>
          <Text className='text'>关于我们</Text>
        </View>
      </View>

      <Button className='logout-btn'>
        退出登录
      </Button>
    </View>
  )
}
