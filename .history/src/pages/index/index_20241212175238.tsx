import { View, Button, Text } from '@tarojs/components'
import Taro, { useLoad, useReachBottom } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { cloud } from '../../utils/cloud'
import FoodRecordsList from '../../components/FoodRecordsList'
import PublishModal from '../../components/PublishModal'
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPublish, setShowPublish] = useState(false)
  const [suggestion, setSuggestion] = useState({ message: '', icon: '' })

  // 获取记录列表
  const fetchRecords = async (pageNum = 1, reset = false) => {
    try {
      const { result } = await cloud.callFunction({
        name: 'food',
        data: {
          action: 'getRecords',
          page: pageNum,
          pageSize: PAGE_SIZE
        }
      })

      if (result.code === 200) {
        const newRecords = result.data.records.map(record => ({
          ...record,
          createdAt: new Date(record.createdAt)
        }))

        setRecords(prev => reset ? newRecords : [...prev, ...newRecords])
        setHasMore(newRecords.length === PAGE_SIZE)
      }
    } catch (err) {
      console.error('获取记录失败:', err)
      Taro.showToast({
        title: '获取记录失败',
        icon: 'none'
      })
    }
  }

  // 首次加载
  useLoad(async () => {
    setIsLoading(true)
    await fetchRecords()
    setIsLoading(false)
  })

  // 监听上拉触底事件
  useReachBottom(async () => {
    if (!hasMore || isLoading) return

    setIsLoading(true)
    const nextPage = page + 1
    setPage(nextPage)
    await fetchRecords(nextPage)
    setIsLoading(false)
  })

  // 处理发布弹窗
  const handleOpenPublish = () => {
    setShowPublish(true)
  }

  const handleModalClose = async (isComplete: boolean) => {
    setShowPublish(false)
    if (isComplete) {
      setPage(1)
      await fetchRecords(1, true)
    }
  }

  if (isLoading && records.length === 0) return null

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
