import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import PublishModal from '../../components/PublishModal'
import './index.scss'

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    try {
      // 检查本地登录状态
      if (!checkIsLoggedIn()) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      // 验证服务器登录状态
      const { result } = (await cloud.callFunction({
        name: 'user',
        data: { action: 'checkLogin' }
      }) as unknown) as CloudResponse

      if (result.code === 200) {
        setUserInfo({
          ...result.data.user,
          isLoggedIn: true
        })
        setIsLoggedIn(true)
      } else {
        clearUserInfo()
        setIsLoggedIn(false)
      }
    } catch (err) {
      console.error('登录状态验证失败:', err)
      clearUserInfo()
      setIsLoggedIn(false)
    } finally {
      setIsLoading(false)
    }
  }

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return null // 或者显示loading界面
  }

  // 如果未登录，显示登录提示
  if (!isLoggedIn) {
    return (
      <View className='login-tip'>
        <View className='tip-content'>
          <Text className='title'>欢迎使用</Text>
          <Text className='desc'>登录后开启美食探索之旅</Text>
          <Button
            className='login-btn'
            onClick={() => redirectTo({ url: '/pages/login/index' })}
          >
            立即登录
          </Button>
        </View>
      </View>
    )
  }

  // 已登录显示正常内容
  return (
    <View className='index'>
      {/* 顶部搜索栏 */}
      <View className='search-bar'>
        <View className='search-input'>
          <Text className='placeholder'>搜索</Text>
        </View>
      </View>

      {/* 功能导航 */}
      <View className='nav-grid'>
        <View className='nav-item'>
          <Text className='nav-text'>功能1</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能2</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能3</Text>
        </View>
        <View className='nav-item'>
          <Text className='nav-text'>功能4</Text>
        </View>
      </View>

      {/* 内容列表 */}
      <View className='content-list'>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题1</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
        <View className='content-item'>
          <View className='content-info'>
            <Text className='title'>内容标题2</Text>
            <Text className='desc'>内容描述...</Text>
          </View>
        </View>
      </View>

      {/* 悬浮发布按钮 */}
      <Button
        className='float-publish-btn'
        onClick={() => setShowPublish(true)}
      >
        <Text className='plus'>+</Text>
      </Button>

      {/* 发布弹窗 */}
      <PublishModal
        visible={showPublish}
        onClose={() => setShowPublish(false)}
      />
    </View>
  )
}
