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
        scrollY
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onRefresh}
      >
        <View className='records-container'>
          {records.map(record => (
            <View key={record._id} className='record-card'>
              <Image className='food-image' src={record.imageUrl} mode='aspectFill' />
              <View className='food-info'>
                <View className='food-header'>
                  <Text className='food-name'>{record.food}</Text>
                  {record.count && record.unit && (
                    <Text className='food-amount'>{record.count}{record.unit}</Text>
                  )}
                </View>
                {record.nutrients && (
                  <View className='nutrients-row'>
                    <View className='nutrient-item'>
                      <Text className='value'>{record.nutrients.calories}</Text>
                      <Text className='label'>千卡</Text>
                    </View>
                    <View className='nutrient-item'>
                      <Text className='value'>{record.nutrients.protein}</Text>
                      <Text className='label'>蛋白质</Text>
                    </View>
                    <View className='nutrient-item'>
                      <Text className='value'>{record.nutrients.fat}</Text>
                      <Text className='label'>脂肪</Text>
                    </View>
                  </View>
                )}
                {record.description && (
                  <Text className='description'>{record.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Button
        className='float-publish-btn'
        onClick={() => setShowPublish(true)}
      >
        <Text className='plus'>+</Text>
      </Button>

      <PublishModal
        visible={showPublish}
        onClose={handlePublishComplete}
      />
    </View>
  )
}
