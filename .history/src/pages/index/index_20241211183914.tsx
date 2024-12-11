import { View, Text, ScrollView, Button } from '@tarojs/components'
import Taro, { useLoad, redirectTo, cloud, nextTick } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { checkIsLoggedIn, getUserInfo, setUserInfo, clearUserInfo } from '../../utils/auth'
import { CloudResponse } from '../../types/cloud'
import PublishModal from '../../components/PublishModal'
import FoodGridCard from '../../components/FoodGridCard'
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
  createdAt: string | Date
  _openid?: string
  fileID?: string
}

interface GroupedRecords {
  date: string;
  records: FoodRecord[];
}

const PAGE_SIZE = 10 // 每页加载数量

export default function Index() {
  const [showPublish, setShowPublish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [scrollTop, setScrollTop] = useState<number | undefined>(undefined)
  const lastScrollTopRef = useRef(0)
  const modalOpenScrollTopRef = useRef(0)
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecords[]>([])

  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 格式化日期
  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return `${d.getMonth() + 1}-${d.getDate()}`
  }

  // 对记录进行分组
  const groupRecordsByDate = (recordsList: FoodRecord[]) => {
    const groups: { [key: string]: FoodRecord[] } = {}

    recordsList.forEach(record => {
      const date = formatDate(record.createdAt)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(record)
    })

    return Object.entries(groups)
      .map(([date, groupRecords]) => ({ date, records: groupRecords }))
      .sort((a, b) => new Date(b.records[0].createdAt).getTime() - new Date(a.records[0].createdAt).getTime())
  }

  // 获取食物记录
  const fetchRecords = async (pageNum = 1, refresh = false) => {
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
          const reversed = newRecords.reverse()
          setRecords(reversed)
          setGroupedRecords(groupRecordsByDate(reversed))
        } else {
          setRecords(prev => {
            const updated = [...newRecords.reverse(), ...prev]
            setGroupedRecords(groupRecordsByDate(updated))
            return updated
          })
        }

        if (pageNum === 1) {
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
    await fetchRecords(1, true)
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
        await fetchRecords() // 录验证成功后加载数据
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

  // 处理滚动
  const handleScroll = (e) => {
    const currentScrollTop = e.detail.scrollTop
    lastScrollTopRef.current = currentScrollTop
  }

  // 处理打开发布弹窗
  const handleOpenPublish = () => {
    modalOpenScrollTopRef.current = lastScrollTopRef.current
    setShowPublish(true)
  }

  // 处理弹窗关闭
  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)

    if (isComplete) {
      setPage(1)
      await fetchRecords(1, true)
    } else {
      setScrollTop(modalOpenScrollTopRef.current)
    }
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <View className='header-section'>
        <View className='stats-card'>
          <View className='stats-header'>
            <Text className='title'>今日摄入</Text>
            <Text className='date'>12月11日</Text>
          </View>
          <View className='stats-grid'>
            <View className='stat-item'>
              <Text className='value calories'>2100</Text>
              <Text className='label'>卡路里</Text>
            </View>
            <View className='stat-item'>
              <Text className='value protein'>65g</Text>
              <Text className='label'>蛋白质</Text>
            </View>
            <View className='stat-item'>
              <Text className='value carbs'>280g</Text>
              <Text className='label'>碳水</Text>
            </View>
          </View>
        </View>

        <View className='quick-add'>
          <View className='quick-item'>
            <Text className='icon'>🍚</Text>
            <Text className='text'>米饭</Text>
          </View>
          <View className='quick-item'>
            <Text className='icon'>🥚</Text>
            <Text className='text'>鸡蛋</Text>
          </View>
        </View>

        <View className='daily-goals'>
          <View className='goal-item'>
            <View className='goal-header'>
              <Text className='label'>卡路里目标</Text>
              <Text className='value'>2100/2500</Text>
            </View>
            <View className='progress-bar'>
              <View className='progress calories' style={{ width: '84%' }} />
            </View>
          </View>
        </View>

        <View className='filter-tabs'>
          <Text className='tab active'>全部</Text>
          <Text className='tab'>早餐</Text>
          <Text className='tab'>午餐</Text>
          <Text className='tab'>晚餐</Text>
          <Text className='tab'>加餐</Text>
        </View>
      </View>

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
        onScroll={handleScroll}
      >
        <View className='records-container'>
          {isLoading && hasMore && (
            <View className='loading-tip'>加载中...</View>
          )}
          {groupedRecords.map(group => (
            <View key={group.date} className='date-group'>
              <View className='date-label'>
                <Text className='date-text'>{group.date}</Text>
              </View>
              <View className='records-grid'>
                {group.records.map(record => (
                  <View
                    key={record._id}
                    className='record-item'
                  >
                    <FoodGridCard
                      imageUrl={record.imageUrl}
                      food={record.food}
                      count={record.count}
                      unit={record.unit}
                      nutrients={record.nutrients}
                      description={record.description}
                      createdAt={new Date(record.createdAt)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
          {!hasMore && records.length > 0 && (
            <View className='no-more-tip'>没有更多了</View>
          )}
        </View>
      </ScrollView>

      <Button
        className='float-publish-btn'
        onClick={handleOpenPublish}
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
