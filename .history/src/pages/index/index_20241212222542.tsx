import { View, Text, Button } from '@tarojs/components'
import Taro, { useReachBottom, redirectTo, useDidShow } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { cloud } from '../../utils/cloud'
import { checkIsLoggedIn, setUserInfo, clearUserInfo } from '../../utils/auth'
import PublishModal from '../../components/PublishModal'
import FoodRecordsList from '../../components/FoodRecordsList'
import SuggestionBar from '../../components/SuggestionBar'
import { FoodRecord } from '../../types/food'
import './index.scss'

const PAGE_SIZE = 10

// 生成建议消息
const generateSuggestion = (records: FoodRecord[]) => {
  const today = new Date().toISOString().split('T')[0]
  const todayRecords = records.filter(record =>
    new Date(record.createdAt).toISOString().split('T')[0] === today
  )

  if (todayRecords.length === 0) {
    return {
      message: '今天还没有记录饮食哦，记得及时记录~',
      icon: '🍽️'
    }
  }

  const nutrients = todayRecords.reduce((acc, record) => {
    if (record.nutrients) {
      acc.protein += record.nutrients.protein || 0
      acc.calories += record.nutrients.calories || 0
    }
    return acc
  }, { protein: 0, calories: 0 })

  if (nutrients.calories > 2000) {
    return {
      message: '今天摄入热量有点多啦，建议适量运动一下~',
      icon: '🏃'
    }
  }

  if (nutrients.protein < 40) {
    return {
      message: '今天蛋白质摄入不足，可以适当补充些肉类、蛋类等~',
      icon: '🥩'
    }
  }

  return {
    message: '记得多喝水，保持健康饮食习惯~',
    icon: '💧'
  }
}

export default function Index() {
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPublish, setShowPublish] = useState(false)
  const [suggestion, setSuggestion] = useState({ message: '', icon: '' })
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
        setIsLoggedIn(true)
        await fetchRecords(1, true)
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

  // 初始加载时检查登录状态
  useEffect(() => {
    checkLoginStatus()
  }, [])

  // 页面显示时刷新数据
  useDidShow(() => {
    if (isLoggedIn) {
      setPage(1)
      fetchRecords(1, true)
    }
  })

  // 获取记录列表
  const fetchRecords = async (pageNum: number, refresh = false) => {
    try {
      setIsLoadingMore(true)
      const res = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page: pageNum,
          pageSize: PAGE_SIZE
        }
      })

      if (res.result.code === 200) {
        const newRecords = res.result.data.records.map(record => ({
          ...record,
          createdAt: new Date(record.createdAt)
        }))

        // 打印当天的饮食数据统计
        if (refresh) {
          const today = new Date().toISOString().split('T')[0]
          const todayRecords = newRecords.filter(record =>
            new Date(record.createdAt).toISOString().split('T')[0] === today
          )

          const todayStats = todayRecords.reduce((acc, record) => {
            if (record.nutrients) {
              acc.calories += record.nutrients.calories || 0
              acc.protein += record.nutrients.protein || 0
              acc.carbs += record.nutrients.carbohydrates || 0
              acc.fat += record.nutrients.fat || 0
            }
            return acc
          }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

          console.group('今日饮食统计')
          console.log('记录数量:', todayRecords.length)
          console.log('总热量:', todayStats.calories.toFixed(1), 'kcal')
          console.log('蛋白质:', todayStats.protein.toFixed(1), 'g')
          console.log('碳水化合物:', todayStats.carbs.toFixed(1), 'g')
          console.log('脂肪:', todayStats.fat.toFixed(1), 'g')
          console.log('详细记录:', todayRecords.map(record => ({
            时间: new Date(record.createdAt).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            食物: record.food,
            数量: record.count ? `${record.count}${record.unit || ''}` : '未记录',
            营养素: record.nutrients || '未记录'
          })))
          console.groupEnd()
        }

        setRecords(prev => refresh ? newRecords : [...prev, ...newRecords])
        setHasMore(res.result.data.hasMore)

        if (refresh) {
          setSuggestion(generateSuggestion(newRecords))
        }
      }
    } catch (err) {
      console.error('获取记录失败:', err)
      Taro.showToast({
        title: '获取记录失败',
        icon: 'none'
      })
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // 监听上拉触底事件
  useReachBottom(() => {
    if (isLoadingMore || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchRecords(nextPage)
  })

  // 下拉刷新
  const onPullDownRefresh = async () => {
    setPage(1)
    await fetchRecords(1, true)
    Taro.stopPullDownRefresh()
  }

  // 处理打开发布弹窗
  const handleOpenPublish = () => {
    setShowPublish(true)
  }

  // 处理弹窗关闭
  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)

    if (isComplete) {
      setPage(1)
      await fetchRecords(1, true)
    }
  }

  if (isLoading) return null

  return (
    <View className='index'>
      <SuggestionBar message={suggestion.message} icon={suggestion.icon} />
      <FoodRecordsList records={records} />

      {isLoadingMore && (
        <View className='loading-more'>加载中...</View>
      )}

      {!hasMore && records.length > 0 && (
        <View className='no-more'>没有更多了</View>
      )}

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
