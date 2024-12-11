import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud, nextTick } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
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

const PAGE_SIZE = 10 // 每页加载数量

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [scrollTop, setScrollTop] = useState(0)
  const scrollViewRef = useRef<any>(null)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 获取食物记录
  const fetchRecords = async (pageNum = 1, refresh = false, shouldScroll = false) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page: pageNum,
          pageSize: PAGE_SIZE
        }
      }) as any

      if (result.code === 200) {
        const newRecords = result.data.records
        setHasMore(newRecords.length === PAGE_SIZE)

        if (refresh) {
          setRecords(newRecords.reverse())
        } else {
          setRecords(prev => [...newRecords.reverse(), ...prev])
        }

        // 只有在需要滚动时才更新 scrollTop
        if (shouldScroll) {
          nextTick(() => {
            setScrollTop(99999)
          })
        }
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
    setPage(1)
    await fetchRecords(1, true, true)  // 刷新时需要滚动
    setIsRefreshing(false)
  }

  // 上拉加载更多（加载更早的记录）
  const onScrollToUpper = async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage)
    setIsLoading(false)
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
        await fetchRecords(1, true, true) // 初始加载时也滚动到底部
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

  // 处理弹窗关闭
  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)
    if (isComplete) {
      // 只有在完成时才刷新和滚动
      setPage(1)
      await fetchRecords(1, true, true)
    }
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <ScrollView
        className='records-list'
        scrollY
        scrollTop={scrollTop}
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onRefresh}
        onScrollToUpper={onScrollToUpper}
        upperThreshold={100}
        enhanced
        bounces={false}
        showScrollbar={false}
      >
        <View className='records-container'>
          {isLoading && hasMore && (
            <View className='loading-tip'>加载中...</View>
          )}
          {records.map(record => (
            <View
              key={record._id}
              className='record-item'
            >
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
          {!hasMore && records.length > 0 && (
            <View className='no-more-tip'>没有更多了</View>
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
        onClose={handleModalClose}
      />
    </View>
  )
}
