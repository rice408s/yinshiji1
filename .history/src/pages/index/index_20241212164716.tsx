import { View, Text, Button } from '@tarojs/components'
import Taro, { redirectTo, cloud } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { checkIsLoggedIn, setUserInfo, clearUserInfo } from '../../utils/auth'
import PublishModal from '../../components/PublishModal'
import StatsCard from '../../components/StatsCard'
import CaloriesGoal from '../../components/CaloriesGoal'
import FoodRecordsList from '../../components/FoodRecordsList'
import { FoodRecord } from '../../types/food'
import './index.scss'

const PAGE_SIZE = 10

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
  const [dailyNutrients, setDailyNutrients] = useState({
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0
  })
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    checkLoginStatus()
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      setIsInitialLoad(false)
    }
  }, [records])

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

  // 添加计算当日营养摄入的函数
  const calculateDailyNutrients = (records: FoodRecord[]) => {
    const today = new Date().toISOString().split('T')[0]

    return records
      .filter(record => new Date(record.createdAt).toISOString().split('T')[0] === today)
      .reduce((acc, record) => {
        if (record.nutrients) {
          acc.protein += record.nutrients.protein || 0
          acc.fat += record.nutrients.fat || 0
          acc.carbs += record.nutrients.carbohydrates || 0
          acc.calories += record.nutrients.calories || 0
        }
        return acc
      }, {
        protein: 0,
        fat: 0,
        carbs: 0,
        calories: 0
      })
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
          setDailyNutrients(calculateDailyNutrients(reversed))
        } else {
          setRecords(prev => {
            const updated = [...newRecords.reverse(), ...prev]
            setGroupedRecords(groupRecordsByDate(updated))
            setDailyNutrients(calculateDailyNutrients(updated))
            return updated
          })
        }

        if (isInitialLoad) {
          setIsInitialLoad(false)
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

  // 上拉加载更多（加载更早的记录）
  const onScrollToUpper = async () => {
    if (isLoadingMore || isInitialLoad || !hasMore) return

    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage)
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
        await fetchRecords() // 录验证成功后加载数据
      } else {
        clearUserInfo()
        redirectTo({ url: '/pages/login/index' })
      }
    } catch (err) {
      console.error('登录态验证失败:', err)
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
      <View className='stats-wrapper'>
        <CaloriesGoal
          calories={1241}
          goal={2000}
        />
        <StatsCard
          protein={53.3}
          fat={45.7}
          carbs={162.8}
        />
      </View>

      <FoodRecordsList
        records={records}
        onLoadMore={onScrollToUpper}
        scrollTop={scrollTop}
        isInitialLoad={isInitialLoad}
        onScroll={handleScroll}
      />

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
