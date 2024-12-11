import { View, Text, ScrollView, Button, Image } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import PublishModal from '../../components/PublishModal'
import './index.scss'

interface FoodRecord {
  _id: string
  food: string
  imageUrl: string
  description?: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
  createdAt: Date
}

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 获取食物记录
  const fetchRecords = async () => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: { action: 'getRecords' }
      }) as any

      if (result.code === 200) {
        setRecords(result.data.records)
      }
    } catch (err) {
      console.error('获取记录失败:', err)
      Taro.showToast({
        title: '获取记录失败',
        icon: 'error'
      })
    }
  }

  // 下拉刷新
  const onRefresh = async () => {
    setIsRefreshing(true)
    await fetchRecords()
    setIsRefreshing(false)
  }

  // 检查登录状态后加载数据
  const checkLoginStatus = async () => {
    try {
      if (!checkIsLoggedIn()) {
        setIsLoggedIn(false)
        setIsLoading(false)
        return
      }

      const { result } = await cloud.callFunction({
        name: 'user',
        data: { action: 'checkLogin' }
      }) as any

      if (result.code === 200) {
        setUserInfo({
          ...result.data.user,
          isLoggedIn: true
        })
        setIsLoggedIn(true)
        await fetchRecords() // 登录验证成功后加载数据
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

  // 处理发布完成
  const handlePublishComplete = () => {
    setShowPublish(false)
    fetchRecords() // 刷新记录列表
  }

  if (isLoading) return null

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

  return (
    <View className='index'>
      <ScrollView
        className='records-list'
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
