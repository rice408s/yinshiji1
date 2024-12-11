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
  const [menuButtonInfo, setMenuButtonInfo] = useState<any>(null)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    // 获取系统信息和胶囊按钮位置
    const systemInfo = Taro.getSystemInfoSync()
    const menuButton = Taro.getMenuButtonBoundingClientRect()

    setStatusBarHeight(systemInfo.statusBarHeight || 0)
    setMenuButtonInfo(menuButton)
    setNavBarHeight(menuButton.height + 8) // 胶囊高度 + 上下间距

    if (showAvatar) {
      const localUserInfo = getUserInfo()
      console.log('导航栏 - 获取用户信息:', localUserInfo)
      setUserInfo(localUserInfo)
    }
  }, [showAvatar])

  const handleAvatarClick = () => {
    console.log('导航栏 - 点击头像')
    Taro.switchTab({
      url: '/pages/profile/index'
    }).catch(err => {
      console.error('导航栏 - 跳转失败:', err)
      // 如果 switchTab 失败，尝试使用 navigateTo
      Taro.navigateTo({
        url: '/pages/profile/index'
      })
    })
  }

  return (
    <View className='custom-nav'>
      <View
        className='status-bar'
        style={{ height: `${statusBarHeight}px` }}
      />
      <View
        className='navigation-bar'
        style={{
          height: `${navBarHeight}px`,
          paddingTop: `${(menuButtonInfo?.top || 0) - statusBarHeight}px`
        }}
      >
        <View
          className='nav-content'
          style={{
            width: '100%',
            height: `${menuButtonInfo?.height || 32}px`,
            paddingRight: `${(menuButtonInfo?.width || 87) + 8}px`,
            paddingLeft: showAvatar ? '8px' : `${menuButtonInfo?.margin || 10}px`
          }}
        >
          {showAvatar && (
            <View
              className='avatar-wrapper'
              onClick={handleAvatarClick}
              hoverClass='active'
              style={{
                height: `${menuButtonInfo?.height || 32}px`,
                width: `${menuButtonInfo?.height || 32}px`,
              }}
            >
              <Image
                className='avatar'
                src={userInfo?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
                mode='aspectFill'
                lazyLoad
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
