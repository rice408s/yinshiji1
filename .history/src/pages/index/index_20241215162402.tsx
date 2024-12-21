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

// 添加本地存储的key常量
const LAST_SUGGESTION_KEY = 'last_suggestion'

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

interface CloudResponse {
  result: {
    code: number
    data?: any
    message?: string
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
      }) as unknown as CloudResponse

      if (res.result?.code === 200) {
        const newRecords = res.result.data.records.map(record => ({
          ...record,
          createdAt: new Date(record.createdAt)
        }))

        setRecords(prev => refresh ? newRecords : [...prev, ...newRecords])
        setHasMore(res.result.data.hasMore)
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
      // 添加记录后刷新建议
      handleRefreshSuggestion()
    }
  }

  // 保存建议到本地存储
  const saveSuggestion = (newSuggestion: { message: string; icon: string }) => {
    try {
      Taro.setStorageSync(LAST_SUGGESTION_KEY, {
        ...newSuggestion,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('保存建议失败:', err)
    }
  }

  // 获取本地存储的建议
  const getLastSuggestion = () => {
    try {
      const saved = Taro.getStorageSync(LAST_SUGGESTION_KEY)
      if (saved && saved.timestamp) {
        // 检查是否是今天的建议
        const savedDate = new Date(saved.timestamp).toISOString().split('T')[0]
        const today = new Date().toISOString().split('T')[0]

        if (savedDate === today) {
          return {
            message: saved.message,
            icon: saved.icon
          }
        }
      }
      return null
    } catch (err) {
      console.error('获取保存的建议失败:', err)
      return null
    }
  }

  // 修改刷新建议的函数
  const handleRefreshSuggestion = async () => {
    if (!records.length) return

    const today = new Date().toISOString().split('T')[0]
    const todayRecords = records.filter(record =>
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

    const summary = `
今日饮食记录摘要：
-------------------
共记录 ${todayRecords.length} 餐饮食。

营养摄入：
- 总热量：${todayStats.calories.toFixed(0)} 千卡
- 蛋白质：${todayStats.protein.toFixed(0)}g
- 碳水化合物：${todayStats.carbs.toFixed(0)}g
- 脂肪：${todayStats.fat.toFixed(0)}g

详细记录：
${todayRecords.map((record, index) => `
${index + 1}. ${record.food}
   时间：${new Date(record.createdAt).toLocaleTimeString('zh-CN', {
     hour: '2-digit',
     minute: '2-digit',
     hour12: false
   })}
   数量：${record.count ? `${record.count}${record.unit || ''}` : '未记录'}
`).join('')}
-------------------`

    try {
      const suggestRes = await cloud.callFunction({
        name: 'doubao',
        data: {
          action: 'suggest',
          dietSummary: summary
        }
      }) as unknown as CloudResponse

      if (suggestRes.result.code === 200) {
        const newSuggestion = {
          message: suggestRes.result.data.suggestion,
          icon: '🥗'
        }
        setSuggestion(newSuggestion)
        saveSuggestion(newSuggestion) // 保存新建议
      }
    } catch (err) {
      console.error('刷新建议失败:', err)
      Taro.showToast({
        title: '获取建议失败',
        icon: 'none'
      })
    }
  }

  // 修改初始化建议的逻辑
  useEffect(() => {
    const lastSuggestion = getLastSuggestion()
    if (lastSuggestion) {
      // 如果有今天的建议，直接使用
      setSuggestion(lastSuggestion)
    } else if (records.length > 0) {
      // 如果有记录但没有今天的建议
      setSuggestion({
        message: '点击刷新按钮获取今日饮食建议~',
        icon: '🔄'
      })
    } else {
      // 如果没有记录
      setSuggestion({
        message: '今天还没有记录饮食��，记得及时记录~',
        icon: '🍽️'
      })
    }
  }, [records.length === 0])

  if (isLoading) return null

  return (
    <View className='index'>
      <SuggestionBar
        message={suggestion.message}
        icon={suggestion.icon}
        onRefresh={handleRefreshSuggestion}
      />
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
