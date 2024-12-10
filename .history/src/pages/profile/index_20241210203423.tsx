import { View, Text, Button } from '@tarojs/components'
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

        // 清除本地用户信息
        setUserInfo(null)

        // 延迟跳转到登录页
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

      <Button className='logout-btn' onClick={handleLogout}>
        退出登录
      </Button>
    </View>
  )
}
