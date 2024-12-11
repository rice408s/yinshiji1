import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { getUserInfo } from '../../utils/auth'
import './index.scss'

interface Props {
  mode?: 'home' | 'back'
}

export default function CustomNavigationBar({ mode = 'home' }: Props) {
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [menuRect, setMenuRect] = useState<any>(null)

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync()
    const menuButton = Taro.getMenuButtonBoundingClientRect()

    setStatusBarHeight(systemInfo.statusBarHeight || 0)
    setMenuRect(menuButton)
  }, [])

  const handleAvatarClick = () => {
    Taro.navigateTo({
      url: '/pages/profile/index'
    })
  }

  const handleBackClick = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  const navHeight = menuRect ? (menuRect.height + (menuRect.top - statusBarHeight) * 2) : 44

  return (
    <View className='custom-nav'>
      <View
        className='nav-bar'
        style={{
          paddingTop: `${statusBarHeight}px`,
          height: `${navHeight + statusBarHeight}px`
        }}
      >
        <View
          className='nav-content'
          style={{
            height: `${navHeight}px`,
            paddingRight: menuRect ? `${menuRect.width + 12}px` : '87px'
          }}
        >
          {mode === 'home' ? (
            <View
              className='avatar'
              onClick={handleAvatarClick}
              style={{
                width: `${menuRect?.height || 32}px`,
                height: `${menuRect?.height || 32}px`,
                marginLeft: '12px'
              }}
            >
              <Image
                src={getUserInfo()?.avatarUrl || 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'}
                mode='aspectFill'
              />
            </View>
          ) : (
            <View
              className='back-button'
              onClick={handleBackClick}
              style={{
                width: `${menuRect?.height || 32}px`,
                height: `${menuRect?.height || 32}px`,
                marginLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View className='back-arrow' />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}