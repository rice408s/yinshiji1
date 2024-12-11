import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { getUserInfo } from '../../utils/auth'
import './index.scss'

interface Props {
  mode?: 'home' | 'back'
  title?: string
}

export default function CustomNavigationBar({ mode = 'home', title }: Props) {
  const [systemInfo, setSystemInfo] = useState<any>(null)
  const [menuButtonInfo, setMenuButtonInfo] = useState<any>(null)

  useEffect(() => {
    // 获取系统信息和胶囊按钮位置信息
    const sys = Taro.getSystemInfoSync()
    const menuButton = Taro.getMenuButtonBoundingClientRect()
    setSystemInfo(sys)
    setMenuButtonInfo(menuButton)
  }, [])

  const handleAvatarClick = () => {
    Taro.navigateTo({
      url: '/pages/profile/index'
    })
  }

  const handleBackClick = () => {
    Taro.navigateBack()
  }

  if (!systemInfo || !menuButtonInfo) return null

  // 计算导航栏高度
  const navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height
  // 左侧内容到屏幕左侧的距离
  const leftDistance = systemInfo.windowWidth - menuButtonInfo.right + menuButtonInfo.width

  return (
    <View className='nav-bar'>
      {/* 状态栏占位 */}
      <View style={{ height: systemInfo.statusBarHeight + 'px' }} />

      {/* 导航栏主体 */}
      <View
        className='nav-bar__content'
        style={{ height: navBarHeight + 'px' }}
      >
        {/* 左侧区域 */}
        <View
          className='nav-bar__left'
          style={{
            height: menuButtonInfo.height + 'px',
            lineHeight: menuButtonInfo.height + 'px',
            left: leftDistance + 'px',
            top: (navBarHeight - menuButtonInfo.height) / 2 + 'px'
          }}
        >
          {mode === 'home' ? (
            <View
              className='nav-bar__avatar'
              onClick={handleAvatarClick}
              style={{
                width: menuButtonInfo.height + 'px',
                height: menuButtonInfo.height + 'px'
              }}
            >
              <Image
                src={getUserInfo()?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
                mode='aspectFill'
              />
            </View>
          ) : (
            <View
              className='nav-bar__back'
              onClick={handleBackClick}
            >
              <View className='nav-bar__back-icon' />
            </View>
          )}
        </View>

        {/* 中间标题 */}
        {title && (
          <View
            className='nav-bar__title'
            style={{
              lineHeight: menuButtonInfo.height + 'px',
              height: menuButtonInfo.height + 'px',
              left: leftDistance + menuButtonInfo.width + 'px',
              right: leftDistance + menuButtonInfo.width + 'px'
            }}
          >
            {title}
          </View>
        )}
      </View>
    </View>
  )
}
