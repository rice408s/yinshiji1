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
  const [showPublish, setShowPublish] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [records, setRecords] = useState<FoodRecord[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [suggestion, setSuggestion] = useState({ message: '', icon: '' })

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
    setSuggestion(generateSuggestion(records))
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
  const onReachBottom = async () => {
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

      <Button className='float-publish-btn' onClick={handleOpenPublish}>
        <Text className='plus'></Text>
      </Button>

      <PublishModal visible={showPublish} onClose={handleModalClose} />
    </View>
  )
}
