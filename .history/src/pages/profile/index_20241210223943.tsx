import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro, { cloud, showToast } from '@tarojs/taro'
import { useState } from 'react'
import { getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import CustomNavigationBar from '../../components/custom-navigation-bar'
import './index.scss'

export default function Profile() {
  const [userInfo, setLocalUserInfo] = useState(getUserInfo())

  const handleChooseAvatar = async (e) => {
    const { avatarUrl } = e.detail

    try {
      // 调用云函数更新头像
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateAvatar',
          avatarUrl
        }
      }) as any

      if (result.code === 200) {
        // 更新本地存储
        const newUserInfo = {
          ...userInfo!,
          avatarUrl
        }
        setUserInfo(newUserInfo)
        setLocalUserInfo(newUserInfo)

        showToast({
          title: '头像更新成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        throw new Error(result.message || '头像更新失败')
      }
    } catch (err: any) {
      console.error('头像更新失败:', err)
      showToast({
        title: err.message || '头像更新失败',
        icon: 'error',
        duration: 2000
      })
    }
  }

  const handleNicknameChange = async (e) => {
    const nickName = e.detail.value.trim()
    if (!nickName) return

    try {
      // 调用云函数更新昵称
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateNickname',
          nickName
        }
      }) as any

      if (result.code === 200) {
        // 更新本地存储
        const newUserInfo = {
          ...userInfo!,
          nickName
        }
        setUserInfo(newUserInfo)
        setLocalUserInfo(newUserInfo)

        showToast({
          title: '昵称更新成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        throw new Error(result.message || '昵称更新失败')
      }
    } catch (err: any) {
      console.error('昵称更新失败:', err)
      showToast({
        title: err.message || '昵称更新失败',
        icon: 'error',
        duration: 2000
      })
    }
  }

  const handleLogout = async () => {
    try {
      // 调用云函数退出登录
      const { result } = await cloud.callFunction({
        name: 'user',
        data: { action: 'logout' }
      }) as any

      if (result.code === 200) {
        // 清除本地存储
        clearUserInfo()

        showToast({
          title: '退出成功',
          icon: 'success',
          duration: 2000
        })

        // 延迟跳转，让用户看到提示
        setTimeout(() => {
          Taro.reLaunch({
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
      <CustomNavigationBar showHomeButton />

      <View className='user-card'>
        <Button
          className='avatar-wrapper'
          openType='chooseAvatar'
          onChooseAvatar={handleChooseAvatar}
        >
          <Image
            className='avatar'
            src={userInfo?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
            mode='aspectFill'
          />
        </Button>
        <View className='user-info'>
          <Input
            className='nickname-input'
            type='nickname'
            placeholder='请输入昵称'
            value={userInfo?.nickName}
            onBlur={handleNicknameChange}
          />
          <Text className='tips'>点击头像和昵称进行修改</Text>
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
