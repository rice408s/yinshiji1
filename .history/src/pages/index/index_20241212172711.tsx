import { View, Text, Button } from '@tarojs/components'
import Taro, { redirectTo, cloud } from '@tarojs/taro'
import { useState, useEffect, useRef } from 'react'
import { checkIsLoggedIn, setUserInfo, clearUserInfo } from '../../utils/auth'
import PublishModal from '../../components/PublishModal'
import FoodRecordsList from '../../components/FoodRecordsList'
import SuggestionBar from '../../components/SuggestionBar'
import { FoodRecord } from '../../types/food'
import './index.scss'

const PAGE_SIZE = 10

// 根据营养摄入情况生成建议
const generateSuggestions = (records: FoodRecord[]) => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = records.filter(record =>
    new Date(record.createdAt).toISOString().split('T')[0] === today
  )

  const suggestions = []

  // 如果今天还没有记录
  if (todayRecords.length === 0) {
    suggestions.push({
      icon: '🍳',
      text: '记录今天的第一餐',
      onClick: () => console.log('开始记录')
    })
    return suggestions
  }

  // 计算今日营养摄入
  const nutrients = todayRecords.reduce((acc, record) => {
    if (record.nutrients) {
      acc.protein += record.nutrients.protein || 0
      acc.fat += record.nutrients.fat || 0
      acc.carbs += record.nutrients.carbohydrates || 0
      acc.calories += record.nutrients.calories || 0
    }
    return acc
  }, { protein: 0, fat: 0, carbs: 0, calories: 0 })

  // 根据营养摄入情况生成建议
  if (nutrients.protein < 40) {
    suggestions.push({
      icon: '🥩',
      text: '蛋白质摄入不足',
    })
  }

  if (nutrients.calories > 2000) {
    suggestions.push({
      icon: '🏃',
      text: '建议适量运动',
    })
  }

  if (nutrients.carbs < 200) {
    suggestions.push({
      icon: '🍚',
      text: '可以补充些主食',
    })
  }

  // 添加一些通用建议
  suggestions.push({
    icon: '💧',
    text: '记得多喝水',
  })

  return suggestions
}

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
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    checkLoginStatus()
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      setIsInitialLoad(false)
    }
  }, [records])

  // 更新建议
  useEffect(() => {
    setSuggestions(generateSuggestions(records))
  }, [records])

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
          setRecords(newRecords.reverse())
        } else {
          setRecords(prev => [...newRecords.reverse(), ...prev])
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

  // 上拉加载更多
  const onScrollToUpper = async () => {
    if (isLoadingMore || isInitialLoad || !hasMore) return

    setIsLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage)
    setIsLoadingMore(false)
  }

  // 检查登录状态
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
        await fetchRecords()
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
      <SuggestionBar suggestions={suggestions} />
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
