import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { getUserInfo } from '../../utils/auth'
import './index.scss'

interface Props {
  title?: string
  showAvatar?: boolean
}

export default function CustomNavigationBar({ title, showAvatar = false }: Props) {
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [navBarHeight, setNavBarHeight] = useState(44)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    setStatusBarHeight(systemInfo.statusBarHeight || 0)

    if (showAvatar) {
      const localUserInfo = getUserInfo()
      setUserInfo(localUserInfo)
    }
  }, [showAvatar])

  const handleAvatarClick = () => {
    Taro.switchTab({
      url: '/pages/profile/index'
    })
  }

  return (
    <View className='custom-nav'>
      <View
        className='status-bar'
        style={{ height: `${statusBarHeight}px`, background: '#fff' }}
      />
      <View
        className='navigation-bar'
        style={{ height: `${navBarHeight}px`, background: '#fff' }}
      >
        <View className='nav-content'>
          {showAvatar && (
            <View className='avatar-wrapper' onClick={handleAvatarClick}>
              <Image
                className='avatar'
                src={userInfo?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
                mode='aspectFill'
              />
            </View>
          )}
          <View className='content'>
            <View className='title'>{title}</View>
          </View>
        </View>
      </View>
      <View
        className='placeholder'
        style={{ height: `${statusBarHeight + navBarHeight}px` }}
      />
    </View>
  )
}
