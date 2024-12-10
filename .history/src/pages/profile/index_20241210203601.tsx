import { View, Text, Button, Image } from '@tarojs/components'
import { useLoad, cloud, showToast, redirectTo } from '@tarojs/taro'
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

  const handleLogout = async () => {
    try {
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'logout'
        }
      })

      if (result.code === 200) {
        showToast({
          title: '退出成功',
          icon: 'success',
          duration: 2000
        })

        setUserInfo(null)

        setTimeout(() => {
          redirectTo({
            url: '/pages/login/index'
          })
        }, 2000)
      } else {
        throw new Error(result.message || '退出失败')
      }
    } catch (err: any) {
      console.error('退出失败:', err)
      showToast({
        title: err.message || '退出失败',
        icon: 'error',
        duration: 2000
      })
    }
  }

  return (
    <View className='profile'>
      <View className='user-card'>
        <Image
          className='avatar'
          src={userInfo?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
          mode='aspectFill'
        />
        <View className='user-info'>
          <Text className='nickname'>{userInfo?.nickName || '未登录'}</Text>
          <Text className='tips'>点击头像修改资料</Text>
        </View>
      </View>

      <View className='menu-list'>
        <View className='menu-item'>
          <Text className='text'>个人设置</Text>
          <Text className='arrow'>›</Text>
        </View>
        <View className='menu-item'>
          <Text className='text'>关于我们</Text>
          <Text className='arrow'>›</Text>
        </View>
      </View>

      <Button className='logout-btn' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
}