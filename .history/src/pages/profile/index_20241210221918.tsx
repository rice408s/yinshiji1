import { View, Text, Button, Image, Input } from '@tarojs/components'
import Taro, { useLoad, cloud, showToast } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { clearUserInfo, getUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import CustomNavigationBar from '../../components/custom-navigation-bar'
import './index.scss'

interface UserInfo {
  avatarUrl: string
  nickName: string
  _id?: string
  openid?: string
}

export default function Profile() {
  const [userInfo, setLocalUserInfo] = useState<UserInfo | null>(null)

  // 从本地存储加载用户信息
  useEffect(() => {
    const localUserInfo = getUserInfo()
    console.log('个人中心 - 加载本地用户信息:', localUserInfo)
    if (localUserInfo) {
      setLocalUserInfo(localUserInfo)
    }
  }, [])

  useLoad(async () => {
    try {
      // 从服务器获取最新用户信息
      const { result } = (await cloud.callFunction({
        name: 'user',
        data: {
          action: 'checkLogin'
        }
      }) as unknown) as CloudResponse

      console.log('个人中心 - 服务器返回用户信息:', result)

      if (result.code === 200 && result.data.user) {
        setLocalUserInfo(result.data.user)
      }
    } catch (err) {
      console.error('个人中心 - 获取用户信息失败:', err)
    }
  })

  const handleChooseAvatar = async (e) => {
    try {
      const { avatarUrl } = e.detail
      console.log('个人中心 - 选择新头像:', avatarUrl)

      const { result } = (await cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateUserInfo',
          userInfo: {
            avatarUrl,
            nickName: userInfo?.nickName || '未设置'
          }
        }
      }) as unknown) as CloudResponse

      if (result.code === 200) {
        setLocalUserInfo(result.data.user)
        showToast({
          title: '头像更新成功',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '更新失败')
      }
    } catch (err: any) {
      console.error('个人中心 - 更新头像失败:', err)
      showToast({
        title: err.message || '更新失败',
        icon: 'error'
      })
    }
  }

  const handleNicknameChange = async (e) => {
    try {
      const { value: nickName } = e.detail
      if (!nickName) return

      console.log('个人中心 - 修改昵称:', nickName)

      const { result } = (await cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateUserInfo',
          userInfo: {
            avatarUrl: userInfo?.avatarUrl || '',
            nickName
          }
        }
      }) as unknown) as CloudResponse

      if (result.code === 200) {
        setLocalUserInfo(result.data.user)
        showToast({
          title: '昵称更新成功',
          icon: 'success'
        })
      } else {
        throw new Error(result.message || '更新失败')
      }
    } catch (err: any) {
      console.error('个人中心 - 更新昵称失败:', err)
      showToast({
        title: err.message || '更新失败',
        icon: 'error'
      })
    }
  }

  const handleLogout = async () => {
    try {
      const { result } = await cloud.callFunction({
        name: 'user',
        data: {
          action: 'logout'
        }
      }) as any

      if (result.code === 200) {
        // 先清除本地存储
        clearUserInfo()
        setLocalUserInfo(null)

        await showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1000
        })

        // 使用 setTimeout 确保 Toast 显示完成
        setTimeout(() => {
          // 使用 Taro.reLaunch 重启到登录页
          Taro.reLaunch({
            url: '/pages/login/index'
          }).catch(err => {
            console.error('跳转失败:', err)
          })
        }, 1000)
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
      <CustomNavigationBar title='个人中心' />

      {/* 用户信息卡片 */}
      <View className='user-info-section'>
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
          <View className='info'>
            <Input
              className='nickname'
              type='nickname'
              placeholder='点击输入昵称'
              value={userInfo?.nickName}
              onBlur={handleNicknameChange}
            />
            <Text className='tips'>点击修改头像和昵称</Text>
          </View>
        </View>
      </View>

      {/* 菜单列表 */}
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

      {/* 退出登录按钮 */}
      <View className='bottom-section'>
        <Button className='logout-btn' onClick={handleLogout}>
          退出登录
        </Button>
      </View>
    </View>
  )
}
