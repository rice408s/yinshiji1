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
    navBarHeight: 0
  })

  useEffect(() => {
    // 获取系统信息
    const systemInfo = getSystemInfoSync()
    // 胶囊按钮位置信息
    const menuButtonInfo = getMenuButtonBoundingClientRect()

    // 导航栏高度 = 胶囊按钮顶部距离 - 状态栏高度 + 胶囊按钮高度 + 5
    const navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + 5

    setStyle({
      paddingTop: systemInfo.statusBarHeight,
      height: navBarHeight,
      navBarHeight: navBarHeight
    })
  }, [])

  return (
    <View className='nav-bar' style={{ paddingTop: style.paddingTop + 'px' }}>
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
