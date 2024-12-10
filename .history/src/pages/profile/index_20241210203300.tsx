import { View, Text, Image, Button } from '@tarojs/components'
import { useLoad, cloud } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

interface UserInfo {
  avatarUrl: string
  nickName: string
  // 其他用户信息字段...
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useLoad(async () => {
    try {
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'getUserInfo'
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
      {/* 用户信息卡片 */}
      <View className='user-card'>
        <Image
          className='avatar'
          src={userInfo?.avatarUrl || '../../assets/icons/default-avatar.png'}
        />
        <Text className='nickname'>{userInfo?.nickName || '未登录'}</Text>
      </View>

      {/* 功能列表 */}
      <View className='menu-list'>
        <View className='menu-item'>
          <Image className='icon' src='../../assets/icons/settings.png' />
          <Text className='text'>个人设置</Text>
          <Image className='arrow' src='../../assets/icons/arrow-right.png' />
        </View>
        <View className='menu-item'>
          <Image className='icon' src='../../assets/icons/about.png' />
          <Text className='text'>关于我们</Text>
          <Image className='arrow' src='../../assets/icons/arrow-right.png' />
        </View>
      </View>

      {/* 退出登录按钮 */}
      <Button className='logout-btn' onClick={() => {/* 处理退出登录 */}}>
        退出登录
      </Button>
    </View>
  )
}
