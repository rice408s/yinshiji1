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
  const scrollViewRef = useRef<any>(null)
  const shouldScrollRef = useRef(false)
  const lastScrollTopRef = useRef(0)  // 添加记录上次滚动位置的 ref

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 获取食物记录
  const fetchRecords = async (pageNum = 1, refresh = false, shouldScroll = false) => {
    console.log('获取记录开始:', { pageNum, refresh, shouldScroll })
    shouldScrollRef.current = shouldScroll

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
        console.log('获取记录成功:', {
          count: newRecords.length,
          hasMore: newRecords.length === PAGE_SIZE,
          shouldScroll: shouldScrollRef.current
        })
        setHasMore(newRecords.length === PAGE_SIZE)

        if (refresh) {
          console.log('刷新模式，重置记录')
          setRecords(newRecords.reverse())
        } else {
          console.log('追加模式，添加新记录')
          setRecords(prev => [...newRecords.reverse(), ...prev])
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
    console.log('弹窗关闭:', {
      isComplete,
      currentScrollTop: lastScrollTopRef.current
    })
    setShowPublish(false)

    if (isComplete) {
      console.log('完成操作，准备刷新列表')
      setPage(1)
      await fetchRecords(1, true, true)
    } else {
      console.log('取消操作，保持当前位置')
    }
  }

  // 处理滚动
  const handleScroll = (e) => {
    const { scrollTop } = e.detail
    console.log('滚动事件:', {
      scrollTop,
      lastScrollTop: lastScrollTopRef.current,
      shouldScroll: shouldScrollRef.current
    })
    lastScrollTopRef.current = scrollTop
  }

  // 监听记录变化，控制滚动
  useEffect(() => {
    console.log('记录变化:', {
      recordsLength: records.length,
      shouldScroll: shouldScrollRef.current,
      lastScrollTop: lastScrollTopRef.current
    })

    if (shouldScrollRef.current && records.length > 0) {
      console.log('准备滚动到底部')
      nextTick(() => {
        console.log('nextTick 执行')
        const query = Taro.createSelectorQuery()
        query.select('.records-container').boundingClientRect()
        query.exec((res) => {
          console.log('获取容器高度:', res[0]?.height)
          if (res[0]) {
            console.log('执行滚动')
            Taro.pageScrollTo({
              scrollTop: res[0].height,
              duration: 0
            })
            shouldScrollRef.current = false
          }
        })
      })
    } else if (!shouldScrollRef.current) {
      console.log('保持当前滚动位置:', lastScrollTopRef.current)
      nextTick(() => {
        Taro.pageScrollTo({
          scrollTop: lastScrollTopRef.current,
          duration: 0
        })
      })
    }
  }, [records])

  if (isLoading) return null

  return (
    <View className='index'>
      <ScrollView
        ref={scrollViewRef}
        className='records-list'
        scrollY
        refresherEnabled
        refresherTriggered={isRefreshing}
        onRefresherRefresh={onRefresh}
        onScrollToUpper={onScrollToUpper}
        upperThreshold={100}
        enhanced
        bounces={false}
        showScrollbar={false}
        onScroll={handleScroll}
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