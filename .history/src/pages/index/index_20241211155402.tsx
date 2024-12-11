import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import PublishModal from '../../components/PublishModal'
import FoodCard from '../../components/PublishModal/FoodCard'
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
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 获取食物记录
  const fetchRecords = async (page = 1, replace = true, retryCount = 3) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page,
          size: 10
        }
      }) as any

      if (result.code === 200) {
        setRecords(prev => replace ? result.data.records : [...prev, ...result.data.records])
        setHasMore(result.data.hasMore)
        setCurrentPage(page)
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
    await fetchRecords(1, true)
    setIsRefreshing(false)
  }

  // 上拉加载更多
  const onLoadMore = async () => {
    if (!hasMore || isLoadingMore) return

    setIsLoadingMore(true)
    await fetchRecords(currentPage + 1, false)
    setIsLoadingMore(false)
  }

  // 检查登录状态后加载数据
  const checkLoginStatus = async () => {
    try {
      if (!checkIsLoggedIn()) {
        redirectTo({ url: '/pages/login/index' })
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
        await fetchRecords(1, true) // 登录验证成功后加载第一页数据
      } else {
        clearUserInfo()
        redirectTo({ url: '/pages/login/index' })
      }
    } catch (err) {
      console.error('登录状态验证失败:', err)
      clearUserInfo()
      redirectTo({ url: '/pages/login/index' })
    } finally {
      setIsLoading(false)
    }
  }

  // 处理发布完成
  const handlePublishComplete = () => {
    setShowPublish(false)
    onRefresh() // 刷新记录列表
  }

  // 处理滚动到底部
  const handleScrollToLower = () => {
    onLoadMore()
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <ScrollView
        className='records-list'
        scrollY
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onRefresh}
        onScrollToLower={handleScrollToLower}
      >
        <View className='records-container'>
          {records.map(record => (
            <View key={record._id} className='record-item'>
              <FoodCard
                imageUrl={record.imageUrl}
                data={{
                  food: record.food,
                  count: record.count,
                  unit: record.unit,
                  nutrients: record.nutrients
                }}
              />
            </View>
          ))}
          {isLoadingMore && (
            <View className='loading-more'>
              <Text className='text'>加载中...</Text>
            </View>
          )}
          {!hasMore && records.length > 0 && (
            <View className='no-more'>
              <Text className='text'>没有更多了</Text>
            </View>
          )}
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