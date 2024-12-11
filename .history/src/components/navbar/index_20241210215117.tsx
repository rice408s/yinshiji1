import { View, Text, Image } from '@tarojs/components'
import Taro, { getMenuButtonBoundingClientRect, getSystemInfoSync } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import './index.scss'

interface NavBarProps {
  title: string
  avatar?: string
  onAvatarClick?: () => void
}

export default function NavBar({ title, avatar, onAvatarClick }: NavBarProps) {
  const [style, setStyle] = useState({
    paddingTop: 0,
    height: 0,
    navBarHeight: 0,
    isWindows: false
  })

  useEffect(() => {
    // 获取系统信息
    const systemInfo = getSystemInfoSync()
    const menuButtonInfo = getMenuButtonBoundingClientRect()

    // 判断是否为 Windows 平台
    const isWindows = systemInfo.platform === 'windows'

    // Windows 平台特殊处理
    const navBarHeight = isWindows
      ? 48  // Windows 固定导航栏高度
      : (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + 5

    // Windows 平台不需要状态栏高度
    const paddingTop = isWindows ? 0 : systemInfo.statusBarHeight

    setStyle({
      paddingTop,
      height: navBarHeight,
      navBarHeight,
      isWindows
    })
  }, [])

  return (
    <View
      className={`nav-bar ${style.isWindows ? 'windows' : ''}`}
      style={{
        paddingTop: style.paddingTop + 'px',
        // Windows 平台固定在页面底部显示
        top: style.isWindows ? 'auto' : 0,
        bottom: style.isWindows ? 0 : 'auto'
      }}
    >
      <View className='nav-bar-content' style={{ height: style.height + 'px' }}>
        <View className='left'>
          {avatar && (
            <View className='avatar-wrapper' onClick={onAvatarClick}>
              <Image
                className='avatar'
                src={avatar}
                mode='aspectFill'
              />
            </View>
          )}
        </View>
        <View className='center'>
          <Text className='title'>{title}</Text>
        </View>
        <View className='right'></View>
      </View>
    </View>
  )
}
